import { Helmet } from 'react-helmet-async';
import { ExternalLink, Cloud, Shield, Printer, Camera, Lock, Server, Briefcase, BookImage, HardDrive, Info, Star } from 'lucide-react';
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
  commission: string;
  badge?: string;
  badgeColor?: string;
  link: string;
  linkLabel: string;
}

const tools: ToolCard[] = [
  {
    icon: Cloud,
    iconColor: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
    category: 'Cloud Storage & Backup',
    name: 'pCloud',
    description: 'Lifetime cloud storage for your photos and files. Pay once, store forever — no monthly fees, no surprises.',
    why: 'After compressing your photos, pCloud is the best place to store them safely. Their lifetime plan is unmatched value for anyone with a large photo library.',
    price: 'From £175 one-time (lifetime)',
    commission: 'Affiliate',
    badge: 'Our Top Pick',
    badgeColor: 'bg-blue-600',
    // Replace with your pCloud affiliate link from partner.pcloud.com
    link: 'https://partner.pcloud.com/r/153325',
    linkLabel: 'Get Lifetime Storage',
  },
  {
    icon: HardDrive,
    iconColor: 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400',
    category: 'Cloud Storage & Backup',
    name: 'Backblaze',
    description: 'Automatic, unlimited cloud backup for your PC or Mac. Backs up all your original photos in the background, continuously.',
    why: 'Use CompressYourPhoto for sharing optimised copies — Backblaze keeps your originals safe forever. Pairs perfectly together.',
    price: 'From $9/month · Free 30-day trial',
    commission: 'Affiliate',
    // Replace with your Backblaze affiliate link from backblaze.com/business/affiliates
    link: 'https://www.backblaze.com/cloud-backup.html',
    linkLabel: 'Start Free Trial',
  },
  {
    icon: Camera,
    iconColor: 'bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400',
    category: 'Stock Photos',
    name: 'Depositphotos',
    description: 'Over 250 million royalty-free photos, vectors, videos, and music tracks. One of the most affordable stock libraries.',
    why: 'Our users compress their own images — but when they need professional stock photos for a website or campaign, Depositphotos is the best value out there.',
    price: 'From $0.22 per image · Subscription plans available',
    commission: 'Affiliate',
    badge: 'Best Value',
    badgeColor: 'bg-teal-600',
    // Replace with your Depositphotos affiliate link from depositphotos.com/partner-program
    link: 'https://depositphotos.com',
    linkLabel: 'Browse Stock Photos',
  },
  {
    icon: BookImage,
    iconColor: 'bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400',
    category: 'Photo Printing',
    name: 'Mixbook',
    description: 'Create stunning photo books, cards, and calendars from your compressed images. Award-winning print quality.',
    why: 'The natural next step after compressing your photos — turn them into a beautiful printed photo book. 120-day cookie means long earning windows.',
    price: 'Photo books from $14.99 · Cards, calendars & more',
    commission: 'Affiliate',
    badge: 'Top Earner',
    badgeColor: 'bg-pink-600',
    // Replace with your Mixbook affiliate link from Impact.com
    link: 'https://www.mixbook.com',
    linkLabel: 'Create a Photo Book',
  },
  {
    icon: Printer,
    iconColor: 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400',
    category: 'Photo Printing',
    name: 'Printful',
    description: 'Print and sell your photos on products — canvases, framed prints, mugs, t-shirts, phone cases and more. No upfront cost.',
    why: 'Photographers using our tool to optimise images for their portfolio often want to sell prints. Printful makes that simple with no inventory.',
    price: 'Free to start · Pay per order',
    commission: 'Affiliate',
    // Replace with your Printful affiliate link from printful.com/affiliates
    link: 'https://www.printful.com',
    linkLabel: 'Start Selling Prints',
  },
  {
    icon: Camera,
    iconColor: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400',
    category: 'Photography Portfolio',
    name: 'SmugMug',
    description: 'Professional photography portfolio and photo sharing platform. Sell prints, protect your work, and build a stunning gallery.',
    why: 'Photographers who use our tool to optimise their shots need somewhere professional to showcase them. SmugMug is the industry standard.',
    price: 'From $9/month · 14-day free trial',
    commission: 'Affiliate',
    // Replace with your SmugMug affiliate link from ShareASale
    link: 'https://www.smugmug.com',
    linkLabel: 'Build Your Portfolio',
  },
  {
    icon: Lock,
    iconColor: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
    category: 'Privacy & Security',
    name: 'NordVPN',
    description: 'The world\'s leading VPN service. Browse privately, secure your connection on public Wi-Fi, and protect your data online.',
    why: 'If you\'re sharing photos or working with client images online, a VPN keeps your connection private. Massive brand with exceptional conversion rates.',
    price: 'From £2.99/month · 30-day money-back guarantee',
    commission: 'Affiliate',
    badge: 'Highest Commission',
    badgeColor: 'bg-green-600',
    // Replace with your NordVPN affiliate link from affiliate.nordvpn.com
    link: 'https://nordvpn.com',
    linkLabel: 'Get NordVPN',
  },
  {
    icon: Server,
    iconColor: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
    category: 'Web Hosting',
    name: 'Hostinger',
    description: 'Fast, affordable web hosting and website builder for individuals and businesses. Easy setup, great performance.',
    why: 'Bloggers and website owners who use our tool to optimise images for page speed also need reliable hosting. Hostinger is the most recommended affordable host.',
    price: 'From £1.99/month (introductory)',
    commission: 'Affiliate',
    badge: 'High Payout',
    badgeColor: 'bg-purple-600',
    // Replace with your Hostinger affiliate link from hostinger.com/affiliates
    link: 'https://www.hostinger.com',
    linkLabel: 'Get Web Hosting',
  },
  {
    icon: Briefcase,
    iconColor: 'bg-slate-100 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400',
    category: 'Freelance & Creative',
    name: 'Fiverr',
    description: 'Hire freelancers for logo design, photo editing, social media graphics, video editing, and thousands more creative services.',
    why: 'When users need professional image work beyond what our tools offer — custom retouching, product photography, graphic design — Fiverr is where they go.',
    price: 'Services from $5 · No subscription needed',
    commission: 'Affiliate',
    // Replace with your Fiverr affiliate link from affiliates.fiverr.com
    link: 'https://www.fiverr.com',
    linkLabel: 'Find a Designer',
  },
  {
    icon: Shield,
    iconColor: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400',
    category: 'Freelance & Creative',
    name: 'Envato Elements',
    description: 'Unlimited downloads of premium templates, graphics, fonts, photos, video footage, and more. One flat monthly subscription.',
    why: 'Content creators and marketers using our tool to optimise images also need templates and graphics to go with them. Envato is the ultimate creative subscription.',
    price: 'From $16.50/month · Cancel any time',
    commission: 'Affiliate',
    badge: '$20–$120/signup',
    badgeColor: 'bg-yellow-600',
    // Replace with your Envato affiliate link from affiliates.envato.com
    link: 'https://elements.envato.com',
    linkLabel: 'Browse Envato Elements',
  },
];

const categories = [
  'Cloud Storage & Backup',
  'Stock Photos',
  'Photo Printing',
  'Photography Portfolio',
  'Privacy & Security',
  'Web Hosting',
  'Freelance & Creative',
];

export default function RecommendedTools() {
  return (
    <div className="flex-1">
      <Helmet>
        <title>Recommended Tools — Best Affiliate Picks for Photographers & Creators | CompressYourPhoto</title>
        <meta name="description" content="Our hand-picked affiliate recommendations: cloud storage, stock photos, photo printing, VPN, web hosting, portfolio hosting, and freelance services for photographers and content creators." />
        <link rel="canonical" href="https://www.compressyourphoto.com/recommended-tools" />
      </Helmet>

      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3 text-xs">Curated by CompressYourPhoto</Badge>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Recommended Tools</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base">
              Hand-picked tools for photographers, content creators, bloggers, and website owners. All different from what we do — and all worth your time.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 mb-10">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Affiliate disclosure:</strong> All links on this page are affiliate links. If you sign up or purchase through them, we earn a small commission at no extra cost to you. This helps keep CompressYourPhoto free. We only list tools we genuinely believe in and that we think complement our own.
            </p>
          </div>

          <AdBanner slot="7293841056" format="horizontal" fullWidth className="mb-10" />

          {categories.map((category) => {
            const categoryTools = tools.filter(t => t.category === category);
            if (categoryTools.length === 0) return null;
            return (
              <div key={category} className="mb-12">
                <h2 className="text-xl font-bold mb-6 pb-2 border-b">{category}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {categoryTools.map((tool) => {
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
                              <span className="text-[10px] text-muted-foreground border rounded px-1.5 py-0.5 uppercase tracking-wide">Affiliate</span>
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
                          rel="noopener noreferrer sponsored"
                          className="mt-auto"
                          data-testid={`link-recommended-${tool.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <Button variant="default" size="sm" className="w-full">
                            {tool.linkLabel}
                            <ExternalLink className="w-3.5 h-3.5 ml-2" />
                          </Button>
                        </a>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <AdBanner slot="8417293056" format="horizontal" fullWidth className="mt-4 mb-10" />

          <div className="text-center p-6 bg-muted/30 rounded-xl">
            <h2 className="font-bold text-lg mb-2">Want to suggest a tool?</h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Know a great tool that would fit our audience? Get in touch at{' '}
              <a href="mailto:contact@compressyourphoto.com" className="text-primary underline">contact@compressyourphoto.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
