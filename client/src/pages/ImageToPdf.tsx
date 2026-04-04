import { useState, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Upload, Download, FileText, Trash2, Crown, Check, GripVertical, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { AdBanner } from '@/components/AdBanner';
import { PremiumModal } from '@/components/PremiumModal';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobalUsage } from '@/hooks/useGlobalUsage';
import { PDFDocument } from 'pdf-lib';

const PAGE_SIZES: Record<string, [number, number]> = {
  A4: [595, 842],
  Letter: [612, 792],
  Square: [595, 595],
};

interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
}

// PDF → Images via canvas (pdfjs)
async function pdfToImages(file: File, isPro: boolean): Promise<string[]> {
  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const urls: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    urls.push(canvas.toDataURL('image/jpeg', 0.92));
  }
  return urls;
}

export default function ImageToPdf() {
  const { isPro } = useAuth();
  const { canUse, usesRemaining, recordUse } = useGlobalUsage();
  const [activeTab, setActiveTab] = useState<'images-to-pdf' | 'pdf-to-images'>('images-to-pdf');

  // Images → PDF state
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<'A4' | 'Letter' | 'Square'>('A4');
  const [converting, setConverting] = useState(false);
  const [pdfResult, setPdfResult] = useState<string | null>(null);
  const [imgError, setImgError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const imgInputRef = useRef<HTMLInputElement>(null);

  // PDF → Images state
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfConverting, setPdfConverting] = useState(false);
  const [pdfImages, setPdfImages] = useState<string[]>([]);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const addImages = useCallback((files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const newItems: ImageItem[] = imageFiles.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      previewUrl: URL.createObjectURL(f),
    }));
    setImages(prev => [...prev, ...newItems]);
    setPdfResult(null);
    setImgError(null);
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => {
      const item = prev.find(i => i.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter(i => i.id !== id);
    });
    setPdfResult(null);
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    setImages(prev => {
      const arr = [...prev];
      const target = index + direction;
      if (target < 0 || target >= arr.length) return arr;
      [arr[index], arr[target]] = [arr[target], arr[index]];
      return arr;
    });
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;
    if (!canUse) { setShowPremiumModal(true); return; }

    setConverting(true);
    setImgError(null);
    try {
      const pdfDoc = await PDFDocument.create();
      const [pW, pH] = PAGE_SIZES[pageSize];

      for (const item of images) {
        const arrayBuffer = await item.file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        let embeddedImg;
        if (item.file.type === 'image/jpeg' || item.file.type === 'image/jpg') {
          embeddedImg = await pdfDoc.embedJpg(bytes);
        } else {
          // Convert non-JPEG to PNG via canvas first
          const img = new Image();
          img.src = item.previewUrl;
          await new Promise<void>(r => { img.onload = () => r(); });
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth; canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0);
          const pngBlob = await new Promise<Blob>(r => canvas.toBlob(b => r(b!), 'image/png'));
          const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
          embeddedImg = await pdfDoc.embedPng(pngBytes);
        }

        const page = pdfDoc.addPage([pW, pH]);
        const { width: iW, height: iH } = embeddedImg;
        const scale = Math.min(pW / iW, pH / iH, 1);
        const w = iW * scale, h = iH * scale;
        const x = (pW - w) / 2, y = (pH - h) / 2;
        page.drawImage(embeddedImg, { x, y, width: w, height: h });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      if (pdfResult) URL.revokeObjectURL(pdfResult);
      setPdfResult(URL.createObjectURL(blob));
      recordUse();
    } catch (err: any) {
      setImgError(err.message || 'Failed to create PDF. Please try again.');
    } finally {
      setConverting(false);
    }
  };

  const downloadPdf = () => {
    if (!pdfResult) return;
    const a = document.createElement('a');
    a.href = pdfResult;
    a.download = 'images-converted.pdf';
    a.click();
  };

  const handlePdfToImages = async () => {
    if (!pdfFile) return;
    if (!canUse) { setShowPremiumModal(true); return; }
    setPdfConverting(true);
    setPdfError(null);
    setPdfImages([]);
    try {
      const urls = await pdfToImages(pdfFile, isPro);
      setPdfImages(urls);
      recordUse();
    } catch (err: any) {
      setPdfError(err.message || 'Failed to convert PDF. Please ensure it is a valid PDF file.');
    } finally {
      setPdfConverting(false);
    }
  };

  const downloadPdfImage = (url: string, index: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${index + 1}.jpg`;
    a.click();
  };

  const downloadAllPdfImages = () => {
    pdfImages.forEach((url, i) => {
      setTimeout(() => downloadPdfImage(url, i), i * 200);
    });
  };

  return (
    <div className="flex-1">
      <Helmet>
        <title>Image to PDF & PDF to Images — Free Online Converter | CompressYourPhoto</title>
        <meta name="description" content="Convert images to PDF or PDF pages to images online for free. Supports JPG, PNG, WebP. 100% private — files never leave your browser. Free up to 5 images, unlimited with Pro." />
        <link rel="canonical" href="https://www.compressyourphoto.com/image-to-pdf" />
        <meta property="og:title" content="Image to PDF & PDF to Images — Free Online Converter" />
        <meta property="og:description" content="Free JPG to PDF converter and PDF to JPG converter. 100% client-side, private and fast." />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Image to PDF Converter — CompressYourPhoto",
          "url": "https://www.compressyourphoto.com/image-to-pdf",
          "applicationCategory": "MultimediaApplication",
          "operatingSystem": "Any (web browser)",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "GBP" },
          "description": "Convert images to PDF or PDF pages to JPG/PNG. 100% client-side, free to use."
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="py-10 md:py-14 px-4 md:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-3 text-xs">Free · No upload · 100% private</Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Image to PDF Converter
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Convert JPG, PNG, or WebP images to a single PDF — or extract PDF pages as images.
            Everything happens in your browser. Your files never leave your device.
          </p>
          {!isPro && (
            <p className="text-xs text-muted-foreground mt-3">
              Free: up to {FREE_IMAGE_LIMIT} images per PDF ·{' '}
              <button onClick={() => setShowPremiumModal(true)} className="text-primary underline">Upgrade for unlimited</button>
            </p>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-4">
        <AdBanner slot="4567890123" format="horizontal" fullWidth />
      </div>

      {/* Tabs */}
      <section className="px-4 md:px-8 pb-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl w-fit mx-auto">
            <button
              onClick={() => setActiveTab('images-to-pdf')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'images-to-pdf' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="tab-images-to-pdf"
            >
              <ImageIcon className="w-4 h-4 inline mr-1.5" />Images → PDF
            </button>
            <button
              onClick={() => setActiveTab('pdf-to-images')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'pdf-to-images' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              data-testid="tab-pdf-to-images"
            >
              <FileText className="w-4 h-4 inline mr-1.5" />PDF → Images
            </button>
          </div>

          {/* ── Images → PDF ── */}
          {activeTab === 'images-to-pdf' && (
            <div className="space-y-4">
              {/* Page size */}
              <div className="flex gap-2 justify-center flex-wrap">
                {(Object.keys(PAGE_SIZES) as Array<keyof typeof PAGE_SIZES>).map(size => (
                  <button
                    key={size}
                    onClick={() => setPageSize(size as 'A4' | 'Letter' | 'Square')}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${pageSize === size ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/40'}`}
                    data-testid={`btn-pagesize-${size}`}
                  >
                    {size}
                  </button>
                ))}
                <span className="text-xs text-muted-foreground self-center">Page size</span>
              </div>

              {/* Drop zone */}
              <div
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
                onDrop={(e) => { e.preventDefault(); addImages(Array.from(e.dataTransfer.files)); }}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => imgInputRef.current?.click()}
                data-testid="upload-area-img-to-pdf"
              >
                <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                <p className="font-semibold text-sm mb-1">Drop images here or click to select</p>
                <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF · {isPro ? 'Unlimited images' : `Up to ${FREE_IMAGE_LIMIT} free`}</p>
                <input ref={imgInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={(e) => e.target.files && addImages(Array.from(e.target.files))}
                  data-testid="input-images" />
              </div>

              {/* Image list */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                    <span>{images.length} image{images.length > 1 ? 's' : ''} selected</span>
                    <button onClick={() => { images.forEach(i => URL.revokeObjectURL(i.previewUrl)); setImages([]); setPdfResult(null); }} className="text-muted-foreground hover:text-red-500 text-xs">Clear all</button>
                  </div>
                  {images.map((item, idx) => (
                    <Card key={item.id} className="p-2 flex items-center gap-3">
                      <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <img src={item.previewUrl} alt="" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                      <span className="text-sm truncate flex-1">{item.file.name}</span>
                      <span className="text-xs text-muted-foreground flex-shrink-0">p.{idx + 1}</span>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => moveImage(idx, -1)} disabled={idx === 0} className="p-1 hover:bg-muted rounded disabled:opacity-30">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => moveImage(idx, 1)} disabled={idx === images.length - 1} className="p-1 hover:bg-muted rounded disabled:opacity-30">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeImage(item.id)} className="p-1 hover:bg-red-50 text-muted-foreground hover:text-red-500 rounded">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {imgError && <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 text-sm text-red-700" data-testid="img-pdf-error">{imgError}</div>}

              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleConvertToPdf} disabled={images.length === 0 || converting} className="flex-1 min-w-[160px]" data-testid="btn-convert-to-pdf">
                  {converting ? <><FileText className="w-4 h-4 mr-2 animate-pulse" />Creating PDF…</> : <><FileText className="w-4 h-4 mr-2" />Create PDF</>}
                </Button>
                {pdfResult && (
                  <Button variant="outline" onClick={downloadPdf} data-testid="btn-download-pdf">
                    <Download className="w-4 h-4 mr-2" />Download PDF
                  </Button>
                )}
              </div>

              {pdfResult && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 text-sm text-green-700 dark:text-green-400 text-center" data-testid="pdf-success">
                  ✓ PDF created from {images.length} image{images.length > 1 ? 's' : ''}. Click download above.
                </div>
              )}
            </div>
          )}

          {/* ── PDF → Images ── */}
          {activeTab === 'pdf-to-images' && (
            <div className="space-y-4">
              {!pdfFile ? (
                <div
                  className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary/40 hover:bg-muted/20 transition-all"
                  onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f?.type === 'application/pdf') setPdfFile(f); }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => pdfInputRef.current?.click()}
                  data-testid="upload-area-pdf"
                >
                  <FileText className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                  <p className="font-semibold text-sm mb-1">Drop a PDF here or click to select</p>
                  <p className="text-xs text-muted-foreground">{isPro ? 'Unlimited pages' : 'Free: first 3 pages'}</p>
                  <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) setPdfFile(f); }}
                    data-testid="input-pdf" />
                </div>
              ) : (
                <Card className="p-3 flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm truncate flex-1">{pdfFile.name}</span>
                  <button onClick={() => { setPdfFile(null); setPdfImages([]); setPdfError(null); }} className="text-muted-foreground hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </Card>
              )}

              {pdfError && (
                <div className={`p-3 rounded-lg border text-sm ${pdfError.includes('Free plan') ? 'bg-yellow-50 border-yellow-200 text-yellow-800' : 'bg-red-50 border-red-200 text-red-700'}`} data-testid="pdf-images-error">
                  {pdfError}{' '}
                  {pdfError.includes('Free plan') && <button onClick={() => setShowPremiumModal(true)} className="text-primary underline">Upgrade to Pro</button>}
                </div>
              )}

              <div className="flex gap-3 flex-wrap">
                <Button onClick={handlePdfToImages} disabled={!pdfFile || pdfConverting} className="flex-1 min-w-[160px]" data-testid="btn-pdf-to-images">
                  {pdfConverting ? <><ImageIcon className="w-4 h-4 mr-2 animate-pulse" />Converting…</> : <><ImageIcon className="w-4 h-4 mr-2" />Convert to Images</>}
                </Button>
                {pdfImages.length > 1 && (
                  <Button variant="outline" onClick={downloadAllPdfImages} data-testid="btn-download-all-pages">
                    <Download className="w-4 h-4 mr-2" />Download All
                  </Button>
                )}
              </div>

              {pdfImages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pdfImages.map((url, i) => (
                    <Card key={i} className="overflow-hidden">
                      <img src={url} alt={`Page ${i + 1}`} className="w-full h-32 object-cover" />
                      <div className="p-2 flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Page {i + 1}</span>
                        <button onClick={() => downloadPdfImage(url, i)} className="text-primary hover:text-primary/80" data-testid={`btn-download-page-${i + 1}`}>
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
        <AdBanner slot="5678901234" format="rectangle" />
      </div>

      {/* How to use */}
      <section className="py-12 md:py-16 bg-muted/30 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">How to Convert Images to PDF</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { step: '1', title: 'Upload Your Images', desc: 'Select JPG, PNG, or WebP images. Free users can combine up to 5 images. Pro users get unlimited.' },
              { step: '2', title: 'Arrange & Set Page Size', desc: 'Reorder images by moving them up or down. Choose A4, Letter, or Square page format.' },
              { step: '3', title: 'Download Your PDF', desc: 'Click "Create PDF" and download instantly. All images fit neatly onto individual pages.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-lg flex items-center justify-center mx-auto mb-3">{s.step}</div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>

          <Card className="p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2"><Check className="w-4 h-4 text-primary" />Pro Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Use A4 for documents and reports — the most universally accepted paper size.</li>
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Reorder images using the up/down arrows before converting to control page order.</li>
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />For PDF → Images, each PDF page becomes a separate high-resolution JPEG file.</li>
              <li className="flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />Your files are never uploaded — all processing is private and happens in your browser.</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Free vs Pro */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Free vs Pro</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5">
              <p className="font-semibold mb-3">Free</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Up to 5 images per PDF', 'First 3 PDF pages to images', 'A4, Letter & Square sizes', 'No sign-up required'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{f}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-5 border-primary/30 bg-primary/[0.02]">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-4 h-4 text-yellow-500" />
                <p className="font-semibold">Pro</p>
                <Badge variant="secondary" className="text-xs ml-auto">from £0.99 trial</Badge>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {['Unlimited images per PDF', 'All PDF pages to images', 'All page sizes', 'All 9 Pro tools included', '100% private processing'].map(f => (
                  <li key={f} className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Button size="sm" className="w-full mt-4" onClick={() => setShowPremiumModal(true)} data-testid="btn-pdf-get-pro">
                <Crown className="w-3.5 h-3.5 mr-1.5" />Try Pro — £0.99 for 7 days
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 bg-muted/30 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: 'How many images can I convert to one PDF for free?', a: 'Free users can combine up to 5 images into a single PDF. Upgrade to Pro for unlimited images per PDF.' },
              { q: 'Are my files uploaded to a server?', a: 'No. All conversion happens entirely in your browser using PDF-lib and PDF.js. Your images and PDFs never leave your device.' },
              { q: 'What image formats can I convert to PDF?', a: 'You can upload JPG, JPEG, PNG, WebP, GIF, and most common image formats. They are automatically fitted to your chosen page size.' },
              { q: 'Can I control the order of pages in my PDF?', a: 'Yes — use the up and down arrows next to each image to reorder them before converting. The PDF will match the order shown.' },
              { q: 'How many PDF pages can I convert to images for free?', a: 'Free users can convert the first 3 pages of a PDF to images. Upgrade to Pro to convert all pages at once.' },
              { q: 'What format are PDF pages exported as?', a: 'PDF pages are exported as high-resolution JPEG images (92% quality). You can download each page individually or all at once.' },
            ].map((item, i) => (
              <Card key={i} className="p-4">
                <p className="font-semibold text-sm mb-1">{item.q}</p>
                <p className="text-sm text-muted-foreground">{item.a}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
        <AdBanner slot="6789012345" format="horizontal" fullWidth />
      </div>

      <PremiumModal open={showPremiumModal} onOpenChange={setShowPremiumModal} />
    </div>
  );
}
