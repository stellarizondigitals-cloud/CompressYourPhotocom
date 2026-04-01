import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowRight, BookOpen, Rss } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blog';

const categoryColors: Record<string, string> = {
  Guide: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Explainer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'How-To': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'SEO & Performance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

export default function BlogIndex() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Helmet>
        <title>Blog — Photo Tips, Guides & Image Editing Tutorials | CompressYourPhoto</title>
        <meta
          name="description"
          content="Practical guides and tutorials on image compression, resizing, converting, and editing. Tips for social media, email, websites and more."
        />
        <link rel="canonical" href="https://www.compressyourphoto.com/blog" />
      </Helmet>

      <div className="flex-1">
        <section className="py-12 md:py-20 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Photo Tips & Guides
            </h1>
            <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Practical tutorials on compressing, resizing, converting and enhancing your photos — for social media, email, websites, and more.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <Link to={`/blog/${featured.slug}`} data-testid={`blog-link-featured-${featured.slug}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 mb-12">
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-5xl">{featured.coverEmoji}</span>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[featured.category] ?? 'bg-muted text-muted-foreground'}`}>
                      {featured.category}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto flex items-center gap-1">
                      <Rss className="w-3 h-3" /> Latest
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">{featured.title}</h2>
                  <p className="text-muted-foreground leading-relaxed mb-5">{featured.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {featured.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {featured.readTime}
                    </span>
                    <span className="flex items-center gap-1.5 text-primary font-medium ml-auto">
                      Read article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} data-testid={`blog-link-${post.slug}`}>
                  <Card className="h-full p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4 h-full flex-col">
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-3xl">{post.coverEmoji}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-muted text-muted-foreground'}`}>
                          {post.category}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h2 className="font-bold text-lg mb-2 leading-snug">{post.title}</h2>
                        <p className="text-sm text-muted-foreground leading-relaxed">{post.description}</p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground w-full pt-2 border-t mt-auto">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span className="flex items-center gap-1 text-primary font-medium ml-auto">
                          Read <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-xl font-semibold mb-3">Try Our Free Tools</h2>
            <p className="text-muted-foreground text-sm mb-6">Everything in these guides is available free — no signup, no upload to servers.</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: 'Compress Images', href: '/compress' },
                { label: 'Resize Photos', href: '/resize' },
                { label: 'Convert Format', href: '/convert' },
                { label: 'Crop Images', href: '/crop' },
                { label: 'Enhance Photos', href: '/enhance' },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  to={tool.href}
                  className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
                  data-testid={`blog-tool-link-${tool.href}`}
                >
                  {tool.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
