import { Helmet } from 'react-helmet-async';
import { ExternalLink, Cloud, Palette, Code2, Archive, Star, Shield, Info } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AdBanner } from '@/components/AdBanner';

interface ToolCard {
  icon: React.ElementType;
  iconColor: string;
  category: string;
  name: string;
  description: string;
  why: string;
  price: string;
  badge?: string;
  badgeColor?: string;
  link: string;
  linkLabel: string;
  isAffiliate: boolean;
}

const tools: ToolCard[] = [
  {
    icon: Cloud,
    iconColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    category: 'Cloud Storage',
    name: 'pCloud',
    description: 'Lifetime cloud storage for your photos and files. Pay once, store forever — no monthly fees, no surprises.',
    why: 'After compressing your photos, pCloud is the best place to store them safely. Their lifetime plan is unmatched value for anyone who takes a lot of photos.',
    price: 'From £175 one-time (lifetime)',
    badge: 'Our Top Pick',
    badgeColor: 'bg-blue-600',
    link: 'https://partner.pcloud.com/r/153325',
    linkLabel: 'Get Lifetime Storage',
    isAffiliate: true,
  },
  {
    icon: Archive,
    iconColor: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    category: 'Cloud Storage',
    name: 'Google One',
    description: 'Expand your Google storage for Drive, Gmail, and Google Photos. Great if you already use Google services.',
    why: 'If you use Android or Gmail, Google One seamlessly integrates with everything you already have.',
    price: 'From £1.59/month',
    link: 'https://one.google.com',
    linkLabel: 'View Google One Plans',
    isAffiliate: false,
  },
  {
    icon: Palette,
    iconColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    category: 'Image Editing',
    name: 'Canva',
    description: 'Design graphics, social media posts, presentations and more. Drag-and-drop editor with thousands of templates.',
    why: 'Before compressing, Canva is great for resizing and adding text to your images. The free plan is genuinely useful.',
    price: 'Free plan available · Pro from £10.99/month',
    link: 'https://www.canva.com',
    linkLabel: 'Try Canva Free',
    isAffiliate: false,
  },
  {
    icon: Palette,
    iconColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    category: 'Image Editing',
    name: 'Adobe Express',
    description: 'Quick, professional-grade photo editing and graphic design. Remove backgrounds, resize, and apply filters.',
    why: 'Ideal when you need more advanced editing before compressing — especially for product photos or social media content.',
    price: 'Free plan available · Premium from £9.98/month',
    link: 'https://www.adobe.com/express/',
    linkLabel: 'Try Adobe Express',
    isAffiliate: false,
  },
  {
    icon: Code2,
    iconColor: 'bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400',
    category: 'Developer Tools',
    name: 'Cloudinary',
    description: 'Automated image optimisation, resizing, and delivery via CDN for websites and apps. Used by Netflix, Airbnb.',
    why: 'If you\'re a developer who needs to compress images at scale on a server or CDN, Cloudinary is the industry standard.',
    price: 'Free tier available · Paid from $89/month',
    link: 'https://cloudinary.com',
    linkLabel: 'View Cloudinary',
    isAffiliate: false,
  },
  {
    icon: Code2,
    iconColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
    category: 'Developer Tools',
    name: 'Squoosh',
    description: 'Google\'s open-source image compression tool for developers. Supports WebP, AVIF, and advanced codecs.',
    why: 'A great technical alternative when you need precise codec control. Fully open source and runs in the browser like us.',
    price: 'Free & open source',
    link: 'https://squoosh.app',
    linkLabel: 'Try Squoosh',
    isAffiliate: false,
  },
];

const categories = ['Cloud Storage', 'Image Editing', 'Developer Tools'];

export default function RecommendedTools() {
  return (
    <div className="flex-1">
      <Helmet>
        <title>Recommended Tools — Best Cloud Storage, Image Editors & More | CompressYourPhoto</title>
        <meta name="description" content="Our recommended tools for storing, editing, and optimising your images. Includes cloud storage picks, photo editors, and developer tools. Some links are affiliate links." />
        <link rel="canonical" href="https://www.compressyourphoto.com/recommended-tools" />
      </Helmet>

      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3 text-xs">Curated by CompressYourPhoto</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Recommended Tools</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Tools we genuinely use and recommend for storing, editing, and optimising your images.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-10">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Affiliate disclosure:</strong> Some links on this page are affiliate links. If you make a purchase through them, we may earn a small commission at no extra cost to you. This helps keep CompressYourPhoto free. We only recommend tools we believe in.
            </p>
          </div>

          <AdBanner slot="7293841056" format="horizontal" fullWidth className="mb-10" />

          {categories.map((category) => (
            <div key={category} className="mb-12">
              <h2 className="text-xl font-bold mb-6 pb-2 border-b">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {tools.filter(t => t.category === category).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Card key={tool.name} className="p-6 flex flex-col gap-4 relative">
                      {tool.badge && (
                        <Badge className={`absolute -top-2.5 left-4 ${tool.badgeColor} text-white border-0 text-xs`}>
                          <Star className="w-3 h-3 mr-1 inline" />
                          {tool.badge}
                        </Badge>
                      )}
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tool.iconColor}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-base">{tool.name}</h3>
                            {tool.isAffiliate && (
                              <span className="text-[10px] text-muted-foreground border rounded px-1.5 py-0.5 uppercase tracking-wide">Affiliate</span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{tool.price}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                      <div className="flex items-start gap-2 bg-muted/40 rounded p-3">
                        <Shield className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground"><strong className="text-foreground">Why we recommend it: </strong>{tool.why}</p>
                      </div>
                      <a
                        href={tool.link}
                        target="_blank"
                        rel={tool.isAffiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
                        className="mt-auto"
                        data-testid={`link-recommended-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        <Button variant={tool.isAffiliate ? 'default' : 'outline'} size="sm" className="w-full">
                          {tool.linkLabel}
                          <ExternalLink className="w-3.5 h-3.5 ml-2" />
                        </Button>
                      </a>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}

          <AdBanner slot="8417293056" format="horizontal" fullWidth className="mt-4 mb-10" />

          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <h2 className="font-bold text-lg mb-2">Want to earn commissions too?</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              pCloud runs an affiliate programme where you can earn commission by recommending their storage to others.
              Contact us at <a href="mailto:contact@compressyourphoto.com" className="text-primary underline">contact@compressyourphoto.com</a> if you'd like to partner with CompressYourPhoto directly.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
