import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, Clock, ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { getBlogPost, getRecentPosts } from '@/data/blog';
import { AdBanner } from '@/components/AdBanner';

function renderMarkdown(content: string) {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let i = 0;
  let keyCounter = 0;

  const key = () => `md-${keyCounter++}`;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key()} className="text-2xl font-bold mt-10 mb-4 leading-tight">
          {line.replace('## ', '')}
        </h2>
      );
      i++;
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key()} className="text-xl font-semibold mt-8 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
      i++;
    } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
      elements.push(
        <p key={key()} className="font-semibold text-foreground mt-4 mb-2">
          {line.replace(/\*\*/g, '')}
        </p>
      );
      i++;
    } else if (line.startsWith('| ')) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        tableLines.push(lines[i]);
        i++;
      }
      const headers = tableLines[0].split('|').filter(Boolean).map((h) => h.trim());
      const rows = tableLines.slice(2).map((row) => row.split('|').filter(Boolean).map((c) => c.trim()));
      elements.push(
        <div key={key()} className="overflow-x-auto my-6">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted">
                {headers.map((h, idx) => (
                  <th key={idx} className="text-left px-4 py-2 font-semibold border border-border">
                    {h === '' ? '' : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx} className="even:bg-muted/40">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-4 py-2 border border-border">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].replace('- ', ''));
        i++;
      }
      elements.push(
        <ul key={key()} className="list-disc list-inside space-y-2 my-4 text-muted-foreground">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    } else if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      elements.push(
        <ol key={key()} className="list-decimal list-inside space-y-2 my-4 text-muted-foreground">
          {items.map((item, idx) => (
            <li key={idx} className="leading-relaxed">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    } else if (line.trim() === '') {
      i++;
    } else {
      elements.push(
        <p key={key()} className="text-muted-foreground leading-relaxed mb-4">
          {renderInline(line)}
        </p>
      );
      i++;
    }
  }

  return elements;
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      if (href.startsWith('/')) {
        return (
          <Link key={idx} to={href} className="text-primary underline hover:no-underline">
            {label}
          </Link>
        );
      }
      return (
        <a key={idx} href={href} className="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    return part;
  });
}

const categoryColors: Record<string, string> = {
  Guide: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Explainer: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'How-To': 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'SEO & Performance': 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;
  const related = getRecentPosts(slug, 3);

  if (!post) {
    return (
      <div className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="text-center">
          <p className="text-4xl mb-4">📄</p>
          <h1 className="text-2xl font-bold mb-3">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">This article doesn't exist or may have been moved.</p>
          <Link to="/blog" className="text-primary underline">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{post.title} | CompressYourPhoto Blog</title>
        <meta name="description" content={post.description} />
        <link rel="canonical" href={`https://www.compressyourphoto.com/blog/${post.slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://www.compressyourphoto.com/blog/${post.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              '@type': 'Organization',
              name: 'CompressYourPhoto',
            },
            publisher: {
              '@type': 'Organization',
              name: 'CompressYourPhoto',
              url: 'https://www.compressyourphoto.com',
            },
          })}
        </script>
      </Helmet>

      <div className="flex-1">
        <section className="py-10 md:py-16 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-transparent">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              data-testid="link-back-to-blog"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Blog
            </Link>

            <div className="flex items-center gap-3 mb-4">
              <span className="text-5xl">{post.coverEmoji}</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-muted text-muted-foreground'}`}>
                {post.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 leading-tight">
              {post.title}
            </h1>

            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {post.description}
            </p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground pb-6 border-b">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                CompressYourPhoto
              </span>
            </div>
          </div>
        </section>

        <section className="py-8 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <AdBanner slot="3745621890" format="horizontal" className="mb-8" fullWidth />

            <article className="prose-style" data-testid="blog-article-content">
              {renderMarkdown(post.content)}
            </article>

            <AdBanner slot="3745621890" format="in-article" className="my-10" />

            <div className="mt-10 pt-8 border-t">
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-6 text-center">
                <p className="text-lg font-semibold mb-2">Try It Free — Right in Your Browser</p>
                <p className="text-muted-foreground text-sm mb-4">No signup, no upload. Your photos never leave your device.</p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  {[
                    { label: '📦 Compress', href: '/compress' },
                    { label: '📐 Resize', href: '/resize' },
                    { label: '🔄 Convert', href: '/convert' },
                    { label: '✂️ Crop', href: '/crop' },
                    { label: '✨ Enhance', href: '/enhance' },
                  ].map((t) => (
                    <Link
                      key={t.href}
                      to={t.href}
                      className="px-4 py-2 rounded-lg bg-background border hover:bg-muted transition-colors text-sm font-medium"
                      data-testid={`blog-cta-tool-${t.href}`}
                    >
                      {t.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 px-4 md:px-8 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">More Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} data-testid={`blog-related-link-${p.slug}`}>
                  <Card className="p-5 h-full hover:shadow-md transition-shadow duration-200">
                    <span className="text-3xl block mb-3">{p.coverEmoji}</span>
                    <h3 className="font-semibold text-sm leading-snug mb-2">{p.title}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p.readTime}
                    </p>
                    <span className="text-xs text-primary flex items-center gap-1 mt-3">
                      Read article <ArrowRight className="w-3 h-3" />
                    </span>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
