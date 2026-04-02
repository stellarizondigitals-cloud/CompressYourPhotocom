import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Shield, Upload, Download, RotateCcw, Eraser, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumModal } from '@/components/PremiumModal';
import { AdBanner } from '@/components/AdBanner';
import { HowToUse } from '@/components/HowToUse';
import { RelatedTools } from '@/components/RelatedTools';

const FREE_LIMIT = 3;
const SESSION_KEY = 'bgRemoveCount';

function getSessionCount(): number {
  return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10);
}
function incrementSessionCount() {
  sessionStorage.setItem(SESSION_KEY, String(getSessionCount() + 1));
}

export default function RemoveBackground() {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  const { isPro } = useAuth();

  const [isDragging, setIsDragging] = useState(false);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPremium, setShowPremium] = useState(false);
  const [darkBg, setDarkBg] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
    setResultUrl(null);
    setErrorMsg('');
    setIsProcessing(true);
    setStatusMsg('Loading AI model (first run may take ~15s)…');

    try {
      const { removeBackground } = await import('@imgly/background-removal');
      setStatusMsg('Analysing image…');
      const resultBlob = await removeBackground(file, {
        publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal@1.7.0/dist/',
        model: 'medium',
        output: { format: 'image/png', quality: 1 },
        progress: (key: string, current: number, total: number) => {
          if (key === 'compute:inference') {
            const pct = Math.round((current / total) * 100);
            setStatusMsg(`Removing background… ${pct}%`);
          }
        },
      });
      const url = URL.createObjectURL(resultBlob);
      setResultUrl(url);
      incrementSessionCount();
      setStatusMsg('');
    } catch (err) {
      console.error(err);
      setErrorMsg('Background removal failed. Please try again or use a different image.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return;

    if (!isPro && getSessionCount() >= FREE_LIMIT) {
      setShowPremium(true);
      return;
    }

    setOriginalFile(file);
    setOriginalUrl(URL.createObjectURL(file));
    processFile(file);
  }, [isPro, processFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleReset = () => {
    setOriginalUrl(null);
    setResultUrl(null);
    setOriginalFile(null);
    setStatusMsg('');
    setErrorMsg('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleDownload = () => {
    if (!resultUrl || !originalFile) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    const name = originalFile.name.replace(/\.[^.]+$/, '') + '-no-bg.png';
    a.download = name;
    a.click();
  };

  const usesLeft = isPro ? Infinity : Math.max(0, FREE_LIMIT - getSessionCount());

  const howToSteps = [
    { step: 1, title: 'Upload your image', description: 'Drag & drop or click to upload any JPG, PNG, or WebP photo.' },
    { step: 2, title: 'AI removes the background', description: 'Our AI model runs entirely in your browser — nothing is uploaded to any server.' },
    { step: 3, title: 'Download as PNG', description: 'Save your image with a transparent background, ready for any use.' },
  ];

  const proTips = [
    'Works best on photos with a clear subject and contrasting background.',
    'Result is always a PNG file — perfect for logos, product photos, and profile pictures.',
    'Use the dark/light background toggle to check edge quality before downloading.',
  ];

  return (
    <>
      <Helmet>
        <title>Remove Image Background Free Online | CompressYourPhoto</title>
        <meta name="description" content="Remove background from any image instantly. AI-powered, 100% private — processed in your browser. No upload. Free online background remover." />
        <link rel="canonical" href="https://www.compressyourphoto.com/remove-background" />
      </Helmet>

      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-8 space-y-3 ${isRTL ? 'text-right md:text-center' : ''}`}>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Remove Image Background
              </h1>
              <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                AI-powered background removal. 100% private — runs entirely in your browser.
              </p>
              {!isPro && (
                <p className="text-sm text-muted-foreground">
                  {usesLeft > 0 ? (
                    <span>{usesLeft} free removal{usesLeft !== 1 ? 's' : ''} remaining this session</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Free limit reached — <button onClick={() => setShowPremium(true)} className="underline">upgrade to Pro</button> for unlimited</span>
                  )}
                </p>
              )}
            </div>

            <div className="max-w-4xl mx-auto">
              {!originalUrl ? (
                <div
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5'}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                  onClick={() => inputRef.current?.click()}
                  data-testid="drop-zone-remove-bg"
                >
                  <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} data-testid="input-remove-bg-file" />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Eraser className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold mb-1">Drop your image here</p>
                      <p className="text-sm text-muted-foreground">or click to browse — JPG, PNG, WebP supported</p>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2" data-testid="button-upload-remove-bg">
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {isProcessing && (
                    <Card className="p-6 text-center space-y-3">
                      <div className="flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      </div>
                      <p className="text-sm text-muted-foreground" data-testid="text-processing-status">{statusMsg}</p>
                      <p className="text-xs text-muted-foreground">Your photo never leaves your device</p>
                    </Card>
                  )}

                  {!isProcessing && (
                    <>
                      {errorMsg && (
                        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-start gap-3" data-testid="error-remove-bg">
                          <span className="text-red-500 mt-0.5">⚠</span>
                          <div className="flex-1">
                            <p className="text-sm text-red-700 dark:text-red-400">{errorMsg}</p>
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 border-red-300 text-red-700 hover:bg-red-50"
                              onClick={() => originalFile && processFile(originalFile)}
                              data-testid="button-retry-remove-bg"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Try Again
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          {resultUrl && <CheckCircle className="w-5 h-5 text-green-500" />}
                          <span className="font-semibold">{resultUrl ? 'Background removed!' : errorMsg ? 'Error' : 'Original'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {resultUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDarkBg(!darkBg)}
                              data-testid="button-toggle-bg"
                            >
                              {darkBg ? '☀️ Light BG' : '🌑 Dark BG'}
                            </Button>
                          )}
                          {!resultUrl && !errorMsg && (
                            <Button
                              size="sm"
                              className="gap-2"
                              onClick={() => originalFile && processFile(originalFile)}
                              data-testid="button-remove-bg-action"
                            >
                              <Eraser className="w-4 h-4" />
                              Remove Background
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={handleReset} className="gap-2" data-testid="button-reset-remove-bg">
                            <RotateCcw className="w-4 h-4" />
                            New Image
                          </Button>
                          {resultUrl && (
                            <Button size="sm" onClick={handleDownload} className="gap-2" data-testid="button-download-remove-bg">
                              <Download className="w-4 h-4" />
                              Download PNG
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className={`grid ${resultUrl ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4`}>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground text-center font-medium">Original</p>
                          <div className="rounded-xl overflow-hidden border bg-muted/30">
                            <img src={originalUrl} alt="Original" className="w-full object-contain max-h-80" />
                          </div>
                        </div>
                        {resultUrl && (
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground text-center font-medium">Background Removed</p>
                            <div
                              className="rounded-xl overflow-hidden border"
                              style={{
                                background: darkBg
                                  ? '#1a1a1a'
                                  : 'repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 0 0 / 20px 20px',
                              }}
                              data-testid="result-preview-remove-bg"
                            >
                              <img src={resultUrl} alt="Background removed" className="w-full object-contain max-h-80" />
                            </div>
                          </div>
                        )}
                      </div>

                      {resultUrl && !isPro && (
                        <div className="text-center text-sm text-muted-foreground">
                          {usesLeft > 0 ? (
                            <span>{usesLeft} free removal{usesLeft !== 1 ? 's' : ''} left this session</span>
                          ) : (
                            <button onClick={() => setShowPremium(true)} className="text-amber-600 underline font-medium">
                              Upgrade to Pro for unlimited background removals
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="max-w-4xl mx-auto text-center mt-8 space-y-2">
              <div className={`flex flex-wrap items-center justify-center gap-2 md:gap-3 text-sm text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                <span className={`flex items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <Shield className="w-4 h-4 text-primary" />
                  100% private — no upload
                </span>
                <span>·</span>
                <span>AI-powered</span>
                <span>·</span>
                <span>Transparent PNG output</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-xs">JPG</Badge>
                  <Badge variant="secondary" className="text-xs">PNG</Badge>
                  <Badge variant="secondary" className="text-xs">WebP</Badge>
                </span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-8">
              <AdBanner slot="1234567890" format="horizontal" fullWidth />
            </div>
            <div className="max-w-4xl mx-auto mt-6">
              <AdBanner slot="6391827450" format="horizontal" fullWidth />
            </div>

            <div className="max-w-4xl mx-auto mt-12">
              <HowToUse steps={howToSteps} proTips={proTips} />
            </div>

            <div className="max-w-4xl mx-auto mt-12">
              <h2 className="text-2xl font-bold mb-6 text-center">Why remove backgrounds?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Product photos', desc: 'E-commerce sellers use transparent backgrounds for clean product listings on Amazon, Etsy, Shopify.' },
                  { title: 'YouTube thumbnails', desc: 'Cut yourself out of a photo to create professional-looking thumbnails in seconds.' },
                  { title: 'Blog & social media', desc: 'Remove distracting backgrounds from images for cleaner, more professional posts.' },
                ].map(({ title, desc }) => (
                  <Card key={title} className="p-4 space-y-2">
                    <h3 className="font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-12">
              <RelatedTools currentTool="remove-background" />
            </div>
          </div>
        </section>
      </div>

      <PremiumModal open={showPremium} onOpenChange={setShowPremium} />
    </>
  );
}
