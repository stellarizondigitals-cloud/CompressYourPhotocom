import { useState, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Type, Upload, Copy, Check, RefreshCw, Crown, Lightbulb, AlertCircle, Shield, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { PremiumModal } from '@/components/PremiumModal';
import { AdBanner } from '@/components/AdBanner';
import { RelatedTools } from '@/components/RelatedTools';

const FREE_LIMIT = 1;
const SESSION_KEY = 'altTextCount';

function getSessionCount() { return parseInt(sessionStorage.getItem(SESSION_KEY) || '0', 10); }
function incrementSessionCount() { sessionStorage.setItem(SESSION_KEY, String(getSessionCount() + 1)); }

interface AltTextResult {
  primary: string;
  alternative1: string;
  alternative2: string;
  tips: string[];
}

async function resizeImageToBase64(file: File, maxPx = 900): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      resolve({ base64: dataUrl.split(',')[1], mimeType: 'image/jpeg' });
    };
    img.onerror = reject;
    img.src = url;
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2 text-xs gap-1" data-testid="button-copy-alt-text">
      {copied ? <><Check className="w-3 h-3 text-green-500" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
    </Button>
  );
}

function CharCount({ text }: { text: string }) {
  const len = text.length;
  const ok = len <= 125;
  return (
    <span className={`text-xs ${ok ? 'text-muted-foreground' : 'text-amber-600 dark:text-amber-400 font-medium'}`}>
      {len}/125 chars {!ok && '(consider shortening)'}
    </span>
  );
}

export default function AltTextGenerator() {
  const { isPro } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<AltTextResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPremium, setShowPremium] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const sessionUsed = getSessionCount();
  const canGenerate = isPro || sessionUsed < FREE_LIMIT;

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP, etc.)');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be under 10MB.');
      return;
    }
    setError(null);
    setResult(null);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedFile(file);
  }, []);

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

  const generate = async () => {
    if (!selectedFile) return;
    if (!canGenerate) { setShowPremium(true); return; }

    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const { base64, mimeType } = await resizeImageToBase64(selectedFile);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45_000);

      let res: Response;
      try {
        res = await fetch('/api/generate-alt-text', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, mimeType }),
          signal: controller.signal,
        });
      } catch (fetchErr: any) {
        clearTimeout(timeout);
        if (fetchErr?.name === 'AbortError') throw new Error('Request timed out. Please try again.');
        throw new Error('Network error. Please check your connection and try again.');
      }
      clearTimeout(timeout);

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        console.error('[AltText] Non-JSON response:', res.status, text.substring(0, 300));
        throw new Error(
          res.status === 413 ? 'Image is too large. Please try a smaller image.' :
          res.status === 429 ? 'AI service is busy. Please wait a moment and try again.' :
          'Server error. Please try again.'
        );
      }
      if (!res.ok) throw new Error(data.error || 'Generation failed. Please try again.');
      setResult(data);
      if (!isPro) incrementSessionCount();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const remaining = Math.max(0, FREE_LIMIT - sessionUsed);

  return (
    <div className="flex-1">
      <Helmet>
        <title>AI Alt Text Generator — Free SEO Alt Text for Images | CompressYourPhoto</title>
        <meta name="description" content="Generate SEO-optimised alt text for any image instantly using AI. Get 3 alt text variations plus expert SEO tips. Free to try, Pro for unlimited." />
        <link rel="canonical" href="https://www.compressyourphoto.com/alt-text-generator" />
      </Helmet>

      <section className="py-10 md:py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Badge variant="secondary" className="text-xs">AI-Powered</Badge>
              <Badge className="text-xs bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Crown className="w-3 h-3 mr-1 inline" /> Pro Feature
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">AI Alt Text Generator</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Upload any image and get 3 SEO-optimised alt text variations instantly — written by AI, ready to copy into your blog or website.
            </p>
            {!isPro && (
              <p className="mt-3 text-sm text-muted-foreground">
                {remaining > 0
                  ? <span className="text-green-600 dark:text-green-400 font-medium">{remaining} free generation{remaining !== 1 ? 's' : ''} remaining this session</span>
                  : <span>Free limit reached. <button onClick={() => setShowPremium(true)} className="text-primary underline font-medium">Upgrade to Pro</button> for unlimited.</span>
                }
              </p>
            )}
          </div>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors mb-6 ${
              isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/30'
            } ${!canGenerate ? 'opacity-60 pointer-events-none' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => canGenerate && inputRef.current?.click()}
            data-testid="dropzone-alt-text"
          >
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} data-testid="input-alt-text-file" />
            {previewUrl ? (
              <div className="space-y-4">
                <img src={previewUrl} alt="Selected" className="max-h-56 max-w-full mx-auto rounded-lg object-contain shadow" />
                <p className="text-sm text-muted-foreground">{selectedFile?.name}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Drop an image here or click to upload</p>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WebP, HEIC — up to 10MB</p>
                </div>
              </div>
            )}
          </div>

          {!canGenerate && !result && (
            <Card className="p-5 mb-6 border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Free limit reached</p>
                  <p className="text-sm text-muted-foreground mt-0.5">You've used your free alt text generation. Upgrade to Pro for unlimited generations.</p>
                  <Button size="sm" className="mt-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0" onClick={() => setShowPremium(true)} data-testid="button-upgrade-pro">
                    <Crown className="w-3.5 h-3.5 mr-1.5" /> Get Pro Access
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground mb-6">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
            <span>Your image is sent to Google's Gemini AI to generate alt text. It is not stored. All other tools on this site process images locally — only this tool uses an external AI service.</span>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 mb-6">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-3 mb-8">
            <Button
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
              onClick={generate}
              disabled={!selectedFile || isGenerating || !canGenerate}
              data-testid="button-generate-alt-text"
            >
              {isGenerating ? (
                <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating…</>
              ) : (
                <><Type className="w-4 h-4 mr-2" /> Generate Alt Text</>
              )}
            </Button>
            {(previewUrl || result) && (
              <Button variant="outline" onClick={reset} data-testid="button-reset">
                <RefreshCw className="w-4 h-4 mr-1" /> New Image
              </Button>
            )}
          </div>

          {result && (
            <div className="space-y-6 mb-8" data-testid="alt-text-results">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" /> Your Alt Text Options
              </h2>

              {[
                { label: 'Primary', sublabel: 'Concise & accessible — use this as your default', text: result.primary, recommended: true },
                { label: 'Alternative 1', sublabel: 'Keyword-rich — best for SEO-focused content', text: result.alternative1 },
                { label: 'Alternative 2', sublabel: 'Detailed — use when context matters', text: result.alternative2 },
              ].map(({ label, sublabel, text, recommended }) => (
                <Card key={label} className={`p-5 ${recommended ? 'border-primary/40 bg-primary/[0.02]' : ''}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{label}</span>
                        {recommended && <Badge className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 border-0">Recommended</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
                    </div>
                    <CopyButton text={text} />
                  </div>
                  <div className="bg-muted/40 rounded p-3 font-mono text-sm break-words">{text}</div>
                  <div className="mt-2 flex justify-end">
                    <CharCount text={text} />
                  </div>
                </Card>
              ))}

              <Card className="p-5 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-semibold text-sm">SEO Tips for This Image</span>
                </div>
                <ul className="space-y-2">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i + 1}</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              {!isPro && remaining <= 0 && (
                <Card className="p-5 border-primary/30 bg-primary/5 text-center">
                  <Crown className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <p className="font-semibold mb-1">Want unlimited alt text generation?</p>
                  <p className="text-sm text-muted-foreground mb-3">Generate alt text for every image on your site — no limits, no waiting.</p>
                  <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0" onClick={() => setShowPremium(true)}>
                    <Crown className="w-4 h-4 mr-2" /> Upgrade to Pro
                  </Button>
                </Card>
              )}
            </div>
          )}

          <AdBanner slot="4729183056" format="horizontal" fullWidth className="mb-8" />

          <div className="space-y-6 mb-10">
            <h2 className="text-xl font-bold text-center">Why alt text matters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Shield, title: 'Accessibility', desc: 'Screen readers read alt text aloud for visually impaired users. Good alt text is legally required in many countries.' },
                { icon: Type, title: 'SEO Rankings', desc: 'Google cannot see images — it reads alt text. Keyword-rich alt text helps images rank in Google Image Search and boosts page SEO.' },
                { icon: Crown, title: 'Higher Traffic', desc: 'Images with proper alt text drive significantly more traffic. Bloggers who optimise alt text report 15–30% more organic image traffic.' },
              ].map(({ icon: Icon, title, desc }) => (
                <Card key={title} className="p-5">
                  <Icon className="w-8 h-8 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{title}</h3>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-xl font-bold text-center mb-6">How to use alt text</h2>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Upload your image', desc: 'Drop any image — JPG, PNG, WebP, HEIC. The AI analyses what\'s in it.' },
                { step: '2', title: 'Click Generate', desc: 'Gemini AI analyses your image and writes 3 professional alt text options in under 3 seconds.' },
                { step: '3', title: 'Copy and paste', desc: 'Choose the version that fits — copy it directly into your WordPress, Shopify, or HTML img tag\'s alt="" attribute.' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex items-start gap-4 p-4 rounded-lg border bg-card">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm flex-shrink-0">{step}</div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AdBanner slot="5847291036" format="horizontal" fullWidth className="mb-10" />

          <RelatedTools currentTool="alt-text" />
        </div>
      </section>

      <PremiumModal open={showPremium} onOpenChange={setShowPremium} />
    </div>
  );
}
