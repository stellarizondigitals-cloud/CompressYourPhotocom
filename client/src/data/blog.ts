export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readTime: string;
  coverEmoji: string;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-reduce-photo-file-size',
    title: 'How to Reduce Photo File Size Without Losing Quality',
    description: 'A practical guide to shrinking your image files while keeping them sharp — for web, email, social media and more.',
    category: 'Guide',
    date: 'March 28, 2025',
    readTime: '6 min read',
    coverEmoji: '📦',
    content: `
## Why File Size Matters

Every time you share a photo — by email, on a website, or through an app — file size affects how fast it loads and how much storage it uses. A 6 MB photo from your phone might look identical to a 400 KB compressed version, but the difference in speed and usability is enormous.

Large images slow down websites, fill up inboxes, and get rejected by upload forms. Learning to compress them properly is one of the most useful digital skills you can have.

## The Difference Between Quality and File Size

Here's something many people get wrong: **reducing file size does not always mean reducing visible quality**. Images contain a huge amount of redundant data — colour information your eye can't distinguish, metadata from your camera, and compression artefacts from previous saves.

A well-compressed image at 80% quality is virtually indistinguishable from the original at 100%, but can be 60–80% smaller in file size.

## Method 1: Use a Browser-Based Compressor (Fastest)

The simplest way is to use a tool like CompressYourPhoto's free compress tool directly in your browser. Here's how:

1. Go to the **Compress** tool on CompressYourPhoto
2. Drop your image (JPG, PNG, WebP, HEIC, or GIF)
3. Adjust the quality slider — 75–85% is the sweet spot for most photos
4. Download your compressed image

No upload to servers. No signup. Instant results.

## Method 2: Choose the Right Format

The format you save in makes a massive difference:

- **JPG** — best for photos, supports millions of colours, great compression
- **PNG** — best for graphics, logos, screenshots with text; larger files but lossless
- **WebP** — modern format, 25–35% smaller than JPG at same quality; supported by all modern browsers
- **HEIC** — iPhone's native format; very efficient but not widely compatible; convert to JPG for sharing

**Tip:** If you're sharing photos on social media or via email, JPG or WebP will give you the best balance of quality and size.

## Method 3: Resize Before Compressing

If your photo is 4000 × 3000 pixels but you're displaying it at 800 × 600, those extra pixels are wasted data. Resizing the image to the actual display dimensions before compressing it can cut the file size dramatically.

For social media:
- Instagram post: 1080 × 1080 px
- Facebook cover: 851 × 315 px
- LinkedIn banner: 1584 × 396 px

Use the **Resize** tool first, then the **Compress** tool.

## Recommended Quality Settings

| Use Case | Recommended Quality |
|---|---|
| Web / Blog | 75–80% |
| Email attachment | 70–80% |
| Social media | 80–85% |
| Print (digital) | 90–95% |
| Archive copy | 95–100% |

## Common Mistakes to Avoid

**Compressing the same file multiple times.** Each save in a lossy format (like JPG) degrades quality slightly. Always start from the original.

**Using PNG for photos.** PNG is lossless, which sounds good, but it creates much larger files for photos. Use JPG or WebP instead.

**Setting quality too low.** Below 60%, you'll start to see visible pixelation and colour banding. Unless file size is critical, stay above 70%.

## Summary

Reducing photo file size is quick, free, and requires no technical knowledge. Use a browser-based tool, pick the right format, resize to your actual display dimensions, and aim for 75–85% quality for everyday use. Your recipients — and your website visitors — will thank you for it.
    `.trim(),
  },
  {
    slug: 'jpg-vs-png-vs-webp-explained',
    title: 'JPG vs PNG vs WebP: Which Image Format Should You Use?',
    description: 'Not all image formats are equal. Here\'s a clear breakdown of when to use JPG, PNG, WebP, and HEIC — and why it matters.',
    category: 'Explainer',
    date: 'March 20, 2025',
    readTime: '5 min read',
    coverEmoji: '🖼️',
    content: `
## The Most Confusing Question in Digital Photos

You've probably wondered: should I save this as JPG or PNG? Does it matter? The short answer is: yes, it matters a lot — both for quality and file size. Here's everything you need to know.

## JPG (JPEG) — The All-Rounder

**Best for:** Photographs, images with gradients, anything you're sharing online

JPG uses lossy compression, which means it throws away some image data to make files smaller. The genius of JPG is that it throws away the data your eye is least likely to notice — subtle colour variations in smooth areas like sky or skin tones.

**Pros:**
- Very small file sizes
- Supported everywhere
- Great for photographs

**Cons:**
- Loses quality each time you save
- Not suitable for images with sharp edges or text
- No transparency support

**Typical size:** A 12 MP photo in JPG ≈ 2–5 MB at full quality, or 300–800 KB compressed

## PNG — The Precision Format

**Best for:** Screenshots, logos, graphics with text, images needing transparency

PNG uses lossless compression — no data is thrown away. Every pixel is preserved exactly. This makes it perfect for anything that needs to look crisp at any size: logos, icons, UI elements, screenshots.

**Pros:**
- No quality loss
- Supports transparency (alpha channel)
- Perfect for text and sharp lines

**Cons:**
- Much larger files than JPG for photos
- Slower to load on websites

**Typical size:** A screenshot in PNG ≈ 300 KB–2 MB depending on content

## WebP — The Modern Champion

**Best for:** Web use, when you want small files with great quality

WebP is Google's image format designed specifically for the web. It supports both lossy and lossless compression, handles transparency, and produces files 25–35% smaller than JPG or PNG at equivalent quality.

**Pros:**
- Smaller than JPG and PNG
- Supports transparency like PNG
- Supports animation like GIF
- Supported by all modern browsers

**Cons:**
- Not supported by very old software
- Some email clients don't display it

## HEIC — iPhone's Secret Format

**Best for:** Storage on iPhone; needs converting for sharing

HEIC (High Efficiency Image Coding) is what your iPhone uses by default. It's remarkably efficient — storing photos at half the size of JPG with better quality. The problem is compatibility: most non-Apple apps, websites, and services don't accept it.

**When to convert:** Any time you share with a non-iPhone user, upload to a website, or send by email. Use our free [HEIC to JPG converter](/convert-heic-to-jpg) to instantly convert.

## Quick Reference Guide

| Format | Best For | Transparency | File Size | Quality Loss |
|---|---|---|---|---|
| JPG | Photos | No | Small | Yes (on save) |
| PNG | Graphics, logos | Yes | Medium–Large | No |
| WebP | Web images | Yes | Very Small | Minimal |
| HEIC | iPhone photos | No | Very Small | Minimal |
| GIF | Simple animations | Yes | Medium | Yes |

## The Simple Rule

- **Sharing a photo?** Use JPG or WebP
- **Need transparency or sharp text?** Use PNG
- **Building a website?** Use WebP
- **Got an iPhone photo to share?** Convert HEIC to JPG first

You can convert between any of these formats instantly and for free using the [Convert tool](/convert) on CompressYourPhoto.
    `.trim(),
  },
  {
    slug: 'resize-images-for-social-media',
    title: 'The Complete Guide to Resizing Images for Social Media in 2025',
    description: 'Exact pixel dimensions for Instagram, Facebook, LinkedIn, Twitter/X, YouTube and more — plus how to resize without losing quality.',
    category: 'Guide',
    date: 'March 15, 2025',
    readTime: '7 min read',
    coverEmoji: '📱',
    content: `
## Why Social Media Sizes Matter

Every social media platform has different requirements for image dimensions. Upload the wrong size and your photo gets cropped awkwardly, pixelated by upscaling, or compressed aggressively by the platform's algorithms.

Getting the dimensions right before you upload means your images look exactly how you intended — sharp, properly framed, and professional.

## Instagram

Instagram crops images to specific ratios depending on where they appear.

**Feed Posts:**
- Square: 1080 × 1080 px (1:1)
- Portrait: 1080 × 1350 px (4:5) — gets the most screen space in the feed
- Landscape: 1080 × 566 px (1.91:1)

**Stories and Reels:**
- 1080 × 1920 px (9:16)
- Keep important content away from the top and bottom 250 px (UI overlay zone)

**Profile picture:** 110 × 110 px (but upload at 320 × 320 for sharpness)

**Tip:** Instagram recompresses every uploaded image. Start with a high-quality original, then use our [Resize tool](/resize) to get the exact dimensions before uploading.

## Facebook

**Profile picture:** 170 × 170 px (displays at 170px on desktop, 128px on mobile)

**Cover photo:** 851 × 315 px (mobile view is 640 × 360, so keep key content centred)

**Feed image:** 1200 × 630 px for shared links; 1080 × 1080 px for standard posts

**Event cover:** 1920 × 1005 px

**Group cover:** 1640 × 856 px

## LinkedIn

**Profile photo:** 400 × 400 px minimum; up to 7,680 × 4,320 px

**Background / banner:** 1584 × 396 px

**Feed post image:** 1200 × 627 px (1.91:1 ratio)

**Company page logo:** 300 × 300 px

**Article cover image:** 1280 × 720 px

## Twitter / X

**Profile photo:** 400 × 400 px

**Header image:** 1500 × 500 px

**In-tweet image:** 1600 × 900 px for landscape; displayed at 506 × 253 px in timeline

## YouTube

**Thumbnail:** 1280 × 720 px (16:9) — this is the most important image on YouTube; make it count

**Channel art / banner:** 2560 × 1440 px safe area: 1546 × 423 px centred

**Profile picture:** 800 × 800 px

## Pinterest

**Pin:** 1000 × 1500 px (2:3 ratio) — taller pins perform better

**Board cover:** 600 × 600 px

## How to Resize Quickly

1. Open the **Resize** tool on CompressYourPhoto
2. Upload your photo
3. Select **Social Media Presets** from the mode dropdown
4. Choose your platform (Instagram Post, YouTube Thumbnail, LinkedIn, etc.)
5. Click Resize — done in seconds, right in your browser

You can also enter custom pixel dimensions if your platform isn't listed, or resize by percentage.

## Pro Tips

**Always resize from the original.** If you've already compressed or cropped the image, quality degrades further each time you process it. Keep your originals and resize fresh each time.

**Maintain aspect ratio.** If you enter only width, enable "Keep aspect ratio" to let the height calculate automatically. This prevents stretching.

**Check after platform upload.** Some platforms display images differently on mobile vs desktop. Preview both before publishing.

**Use JPG for photos.** After resizing, save as JPG at 85–90% quality for the best balance of sharpness and file size on social media.
    `.trim(),
  },
  {
    slug: 'what-is-heic-convert-iphone-photos',
    title: 'What is HEIC? How to Convert iPhone Photos to JPG (Instantly)',
    description: 'Your iPhone saves photos as HEIC by default. Here\'s why that causes problems and how to convert them to JPG for free.',
    category: 'Explainer',
    date: 'March 8, 2025',
    readTime: '4 min read',
    coverEmoji: '📷',
    content: `
## What is HEIC?

HEIC stands for **High Efficiency Image Container**. It's Apple's default photo format, introduced with iOS 11 in 2017. When you take a photo on any modern iPhone or iPad, it's saved as a .heic file unless you've changed your camera settings.

The format is based on the HEVC video codec and is genuinely impressive: HEIC photos are about **50% smaller than equivalent JPG files** at the same visual quality. That's why Apple adopted it — it lets your iPhone store roughly twice as many photos in the same storage space.

## Why HEIC Causes Problems

Despite being technically superior, HEIC has a major compatibility problem: **it's not universally supported**.

You'll run into issues when:
- Uploading to websites that only accept JPG or PNG
- Sending to a Windows PC user (older Windows versions don't open HEIC without an extension)
- Sharing with Android users
- Using older photo editing software
- Attaching to emails for clients or colleagues
- Posting to platforms that reject HEIC format

## How to Convert HEIC to JPG (3 Methods)

### Method 1: Use Our Free Online Converter (Fastest)

1. Go to [CompressYourPhoto's Convert tool](/convert) or the dedicated [HEIC to JPG page](/convert-heic-to-jpg)
2. Drop your HEIC files (you can do multiple at once)
3. Select **JPG** as the output format
4. Click **Convert** — done in seconds

Everything happens in your browser. Your photos never leave your device. No account needed.

### Method 2: Change iPhone Settings (Prevent the Problem)

If you regularly share photos with non-iPhone users, you can set your iPhone to shoot JPG instead:

1. Open **Settings** on your iPhone
2. Tap **Camera**
3. Tap **Formats**
4. Select **Most Compatible** instead of "High Efficiency"

Your iPhone will now save photos as JPG. The trade-off is slightly larger file sizes, but universal compatibility.

### Method 3: Use AirDrop to a Mac

If you AirDrop or transfer HEIC photos to a Mac, macOS automatically converts them to JPG when you share them further. This is seamless but only works within the Apple ecosystem.

## What Quality Do You Lose?

When converting HEIC to JPG using a good converter like ours, **the quality loss is minimal** — often undetectable to the naked eye. We use 92% JPG quality as our conversion baseline, which preserves sharp details while keeping file sizes reasonable.

If you're converting for professional print use, you can increase the quality slider to 95–100%.

## HEIC vs JPG at a Glance

| | HEIC | JPG |
|---|---|---|
| File size | ~50% smaller | Standard |
| Quality | Excellent | Excellent |
| Compatibility | Apple only | Universal |
| Transparency | No | No |
| Best for | iPhone storage | Sharing everywhere |

## Batch Convert Multiple HEIC Files

Our converter handles multiple files at once. Drop 10, 20, or 50 HEIC photos in, convert them all to JPG in one go, and download as a ZIP file. Free, no limits, no account required.

Try the [HEIC to JPG converter](/convert-heic-to-jpg) →
    `.trim(),
  },
  {
    slug: 'compress-images-for-email',
    title: 'How to Compress Images for Email (Without Them Looking Terrible)',
    description: 'Email attachments have size limits. Here\'s how to compress your photos for email without sacrificing too much quality.',
    category: 'How-To',
    date: 'February 28, 2025',
    readTime: '5 min read',
    coverEmoji: '✉️',
    content: `
## The Email Attachment Problem

Most email services impose attachment limits: Gmail caps attachments at 25 MB per email, Outlook at 20 MB, and many corporate email servers at 10 MB or less. A single photo from a modern smartphone can be 5–12 MB, meaning a few holiday snaps can easily bounce back.

Even when emails go through, large attachments are frustrating — they fill up inboxes, take ages to download on mobile, and get flagged by spam filters.

The solution is simple: compress your images before attaching.

## Target File Sizes for Email

Here's a practical guide to what works well:

| Use Case | Target Size |
|---|---|
| Single photo, casual email | Under 1 MB |
| Professional photo for review | 500 KB – 1.5 MB |
| Multiple photos in one email | 300–600 KB each |
| Logo / graphic for business email | Under 200 KB |
| Image for printing review | 2–5 MB |

For casual personal emails, aim for **under 1 MB per photo**. Recipients can view them perfectly on any device, and they won't clog anyone's inbox.

## Step-by-Step: Compress for Email

1. **Open the [Compress tool](/compress)** on CompressYourPhoto
2. **Drop your image** (JPG, PNG, WebP, HEIC, or GIF)
3. **Set quality to 75–80%** — this usually gives 60–80% size reduction with no visible difference
4. **Enable Max Width** and set it to **1200–1500 px** — full phone camera resolution (4000+ px wide) is overkill for email
5. **Click Compress** and download
6. Check the size shown — if it's still over 1 MB, drop the quality to 70%

## Converting HEIC Before Emailing

iPhone photos in HEIC format often won't display properly for recipients who aren't on Apple devices. Before compressing:

1. Use the [Convert tool](/convert) to convert HEIC to JPG first
2. Then compress the resulting JPG

Or use our [HEIC compress tool](/convert-heic-to-jpg) which handles both steps at once.

## Batch Compress for Sending Multiple Photos

If you're sending a photo album or multiple images:

1. Drop all photos into the Compress tool at once
2. Compress them all in one go
3. Download as a ZIP file using the "Download All" button
4. Attach the ZIP to your email

Many email clients display ZIP attachments clearly and recipients can extract the files easily.

## Tips for Specific Email Clients

**Gmail:** Stays below 25 MB total. For more, use Google Drive and share a link instead.

**Outlook / Office 365:** 20 MB limit. Corporate email servers often have lower limits — check with your IT team.

**Apple Mail:** 20 MB. On iPhone, Apple Mail actually offers to resize photos automatically when you attach them — look for the "Image Size" option at the bottom.

**ProtonMail:** 25 MB total per email.

## When to Use a Link Instead of Attaching

If you need to send many photos or high-resolution files, consider uploading to Google Drive, Dropbox, or WeTransfer and sharing a link instead of attaching. This bypasses all size limits and is often faster for the recipient too.

For most everyday photo sharing though, compressing to under 1 MB each and attaching directly is the simplest approach. Use the [free compression tool](/compress-for-email) to do it in seconds.
    `.trim(),
  },
  {
    slug: 'crop-photos-for-social-media',
    title: 'How to Crop Photos for Social Media Like a Pro',
    description: 'Cropping is more than just cutting — it\'s about composition, focus, and framing. Here\'s how to do it right for every platform.',
    category: 'Guide',
    date: 'February 20, 2025',
    readTime: '6 min read',
    coverEmoji: '✂️',
    content: `
## Why Cropping Matters

A great photo can be ruined by poor cropping — or elevated by smart cropping. The way you frame an image determines what the viewer focuses on, the mood it creates, and whether it fits the platform it's displayed on.

Beyond composition, most social media platforms have strict aspect ratio requirements. Instagram won't display a 16:9 landscape photo properly in its feed. LinkedIn cuts off vertical profile images. YouTube thumbnails must be 16:9 or they'll be stretched.

## Understanding Aspect Ratios

An aspect ratio is the relationship between an image's width and height. The most common are:

- **1:1 (Square)** — Instagram feed, profile pictures
- **4:5 (Portrait)** — Instagram feed posts, gets more screen space
- **16:9 (Landscape)** — YouTube thumbnails, Facebook covers, Twitter headers
- **9:16 (Vertical)** — Instagram Stories, TikTok, YouTube Shorts
- **4:3** — Traditional photos, presentations
- **Circle** — Profile photos displayed as circles (LinkedIn, Twitter, WhatsApp)

## Cropping for Each Platform

### Instagram

The feed now supports three ratios: 1:1 (square), 4:5 (portrait), and 1.91:1 (landscape). Portrait (4:5) gets the most vertical space in the feed, so your image appears larger than competitors' square posts.

For Stories and Reels, always crop to 9:16 and keep faces and important elements in the centre third — the top and bottom are covered by UI elements.

### LinkedIn

Profile photos display as circles. Crop to 1:1 (square) first, then use our circular crop feature to get the circular preview. Upload the square; LinkedIn will round it automatically.

For post images, 1.91:1 works best. For article headers, 1280 × 720 (16:9) is ideal.

### YouTube

Thumbnails are 1280 × 720 px (16:9). Your face (if visible) should take up a large portion of the frame — thumbnails are tiny in search results, so small details get lost.

### Twitter / X

In-feed images display at roughly 2:1. Cropping to 1600 × 800 px ensures nothing important gets cut off in the timeline view.

## Cropping Rules from Photography

**Rule of Thirds:** Divide your image into a 3×3 grid. Place the main subject at one of the four intersection points, not dead centre. This creates more dynamic, interesting compositions.

**Leave Room to Look:** If someone in the photo is looking left, crop to leave more space on the left. The viewer's eye follows the subject's gaze — give it somewhere to go.

**Cut at Joints:** When cropping people, avoid cutting at ankles, wrists, knees, or elbows. Cut between joints (mid-shin, mid-forearm) for a more natural-looking crop.

**Horizon Lines:** Keep horizons level unless you're deliberately going for a Dutch angle effect. A slightly tilted horizon can look like a mistake.

## How to Crop Using CompressYourPhoto

1. Open the **[Crop tool](/crop)**
2. Upload your image
3. Select an **aspect ratio preset** (1:1 for Instagram, 16:9 for YouTube, etc.) or choose Free Crop
4. Drag to position your crop area
5. Use the **rotation slider** if the horizon is off
6. Click **Crop Image** and download

The tool works entirely in your browser — no app to download, no signup required.

## Circular Crops for Profile Photos

When you need a circle-cropped profile photo (for LinkedIn, Twitter, Discord, etc.):

1. Upload your photo
2. Select the **Circle** preset
3. Drag to centre on your face
4. Download — you'll get a PNG with transparent edges

The transparent background means the circle will show cleanly on any colour background. Try the [circle crop tool](/crop-circle) directly.

## After Cropping

Once you've cropped, consider:
- **Compressing** if the file size is over 1 MB for web use
- **Converting to WebP** for faster loading on websites
- **Resizing** to exact platform dimensions (e.g., 1080 × 1080 for Instagram)

All three tools are available free at CompressYourPhoto, and your images never leave your browser.
    `.trim(),
  },
  {
    slug: 'enhance-photo-quality-online',
    title: 'How to Enhance Photo Quality Online Without Photoshop',
    description: 'Brightness, contrast, saturation and sharpness adjustments can transform a flat, dull photo. Here\'s how to do it for free in your browser.',
    category: 'How-To',
    date: 'February 10, 2025',
    readTime: '5 min read',
    coverEmoji: '✨',
    content: `
## You Don't Need Expensive Software

Adobe Photoshop and Lightroom are powerful — but they're expensive, complex, and require installation. For everyday photo touch-ups, you don't need any of that. A few simple adjustments can dramatically improve an ordinary photo right in your browser.

CompressYourPhoto's Enhance tool gives you four key controls: Brightness, Contrast, Saturation, and Sharpness. Understanding what each one does — and when to use it — makes the difference between a mediocre edit and a polished result.

## The Four Controls Explained

### Brightness

Brightness affects the overall lightness or darkness of the entire image.

- **Increase brightness** for underexposed photos (shot in dim light, or the camera metered for the wrong subject)
- **Decrease brightness** for overexposed or washed-out images
- **Avoid going above +30–40%** without adjusting contrast too, or the image will look grey and flat

**Common mistake:** Cranking brightness to fix a dark photo but ignoring the now-grey, washed-out highlights.

### Contrast

Contrast controls the difference between the lightest and darkest parts of your image.

- **Increase contrast** to make images look more punchy and defined — great for landscapes, architecture, products
- **Decrease contrast** for a softer, more cinematic or faded look
- Usually, if you increase brightness, you should also increase contrast slightly to compensate

**Good starting point:** Brightness +15, Contrast +10 for most indoor or dim photos.

### Saturation

Saturation controls colour intensity — from greyscale (0% saturation) to vivid neon colours (maximum saturation).

- **Increase saturation** to make colours pop — great for travel photos, food, nature
- **Decrease saturation** for a muted, moody, or professional look
- **Desaturate completely** to convert to black and white (set to minimum)

**Common mistake:** Over-saturating skin tones makes people look orange or sunburned. Be conservative with saturation on portraits — +10 to +20% is usually enough.

### Sharpness

Sharpness enhances edge contrast, making details appear crisper and more defined.

- **Increase sharpness** for photos that look slightly soft or out of focus
- Especially effective on text, architecture, product photos, and landscapes
- **Avoid over-sharpening** — it creates a harsh, artificial look and amplifies noise in dark areas

**Tip:** Apply sharpness last, after all other adjustments.

## Recommended Settings by Photo Type

**Dark indoor photo:**
- Brightness: +20
- Contrast: +10
- Saturation: 0
- Sharpness: +5

**Flat, grey outdoor shot:**
- Brightness: +5
- Contrast: +20
- Saturation: +15
- Sharpness: +10

**Food or product photo:**
- Brightness: +5
- Contrast: +15
- Saturation: +20
- Sharpness: +15

**Portrait (people):**
- Brightness: +10
- Contrast: +5
- Saturation: +10
- Sharpness: +5 (don't over-sharpen skin)

**Black and white conversion:**
- Saturation: minimum (−100)
- Contrast: +20–30
- Brightness: adjust to taste

## Step-by-Step: Enhance in CompressYourPhoto

1. Open the **[Enhance tool](/enhance)**
2. Upload your photo (JPG, PNG, WebP, HEIC)
3. Adjust the sliders — the preview updates in real time
4. When happy, click **Apply Enhancements**
5. Download your enhanced image

Everything processes locally in your browser. Your original photo is never uploaded or stored.

## What This Tool Can't Do

To set realistic expectations:
- It won't fix severely blurry or out-of-focus photos (that's AI upscaling territory)
- It won't remove objects or people from backgrounds
- It won't colour-grade in a filmic style (that requires LUTs)

For those needs, you'd want Lightroom, Snapseed (free mobile app), or an AI tool. But for 90% of everyday photo improvements, brightness, contrast, saturation and sharpness are all you need.

## Combine With Other Tools

After enhancing, you might want to:
- **[Compress](/compress)** the result to reduce file size for web or email
- **[Resize](/resize)** to exact dimensions for social media
- **[Crop](/crop)** to improve composition

All free, all in your browser, no account needed.
    `.trim(),
  },
  {
    slug: 'image-size-website-speed-seo',
    title: 'Why Image Size Matters for Website Speed and SEO',
    description: 'Unoptimised images are the #1 cause of slow websites. Here\'s what you need to know about image size, loading speed, and search rankings.',
    category: 'SEO & Performance',
    date: 'January 30, 2025',
    readTime: '6 min read',
    coverEmoji: '⚡',
    content: `
## Images Are the Biggest Performance Problem on the Web

According to HTTP Archive data, images account for over 50% of a typical webpage's total data size. On mobile connections, a page that loads 10 large unoptimised images can take 8–15 seconds to fully load. Most users abandon a page that takes more than 3 seconds.

If you have a website — blog, portfolio, e-commerce store, or business site — image optimisation is almost certainly the highest-impact improvement you can make.

## How Image Size Affects Page Speed

Every image on a webpage must be downloaded before it can be displayed. Larger images take longer to download. The effect compounds across multiple images on a page.

**Example:**
- A page with 10 images at 3 MB each = 30 MB of data to download
- The same images compressed to 300 KB each = 3 MB total
- That's a 10× improvement in download load

On a typical 4G mobile connection (around 25 Mbps), 30 MB takes roughly 10 seconds to download. 3 MB takes 1 second.

## The SEO Impact

Google has explicitly stated that page speed is a ranking factor. With the introduction of Core Web Vitals in 2021, image performance became even more important to rankings.

The three Core Web Vitals metrics most affected by images:

**Largest Contentful Paint (LCP):** Measures how long it takes for the largest visible element to load. For most pages, this is a hero image or banner. A large, unoptimised hero image will directly cause a poor LCP score.

**Cumulative Layout Shift (CLS):** Images without defined width/height attributes cause layout shifts as they load, hurting CLS scores.

**First Input Delay (FID) / Interaction to Next Paint (INP):** While less directly affected by images, slow-loading pages generally score worse here too.

## Target File Sizes for Web

| Image Type | Target Size |
|---|---|
| Hero / banner image | 200–400 KB |
| Blog post featured image | 100–200 KB |
| Product thumbnail | 20–60 KB |
| Logo / icon | Under 20 KB |
| Background texture | 50–150 KB |
| Full-width background photo | 300–500 KB |

## Best Practices for Web Images

**1. Use the Right Format**
- Use **WebP** for all photos on modern websites — 25–35% smaller than JPG at the same quality
- Use **SVG** for logos, icons, and illustrations — infinitely scalable, tiny file size
- Use **PNG** only when you need transparency and WebP isn't an option
- Avoid GIF for large animations; use MP4 video instead

**2. Resize to Display Dimensions**
If an image displays at 800 px wide on your page, there's no reason to upload a 4000 px wide file. Resize to 800–1600 px (2× for retina screens) maximum.

**3. Compress Before Uploading**
Even after resizing, run images through a compressor. Use **[CompressYourPhoto](/compress)** to compress to 75–85% quality — the result is virtually identical visually but dramatically smaller.

**4. Lazy Load Below-the-Fold Images**
Add loading="lazy" to img tags for images that appear below the fold. This tells the browser not to download them until the user scrolls near them.

**5. Specify Width and Height**
Always include width and height attributes on img tags. This reserves space for the image before it loads, preventing layout shift.

## How Much of a Difference Does It Make?

In a typical case study:
- Original page: 8.2 MB, 6.4 seconds load time, Google PageSpeed score: 42/100
- After image optimisation: 1.1 MB, 1.8 seconds load time, PageSpeed score: 87/100

No code changes. No infrastructure changes. Just better images.

## Automating Image Optimisation

For websites with many images, consider:
- **Cloudinary** or **Imgix** — cloud-based image transformation and CDN
- **WordPress** — install Smush, ShortPixel, or Imagify plugins
- **Shopify** — use apps like TinyIMG or Crush.pics
- **Next.js** — built-in Image component handles optimisation automatically

For one-off images before uploading, **[CompressYourPhoto](/compress)** handles JPG, PNG, WebP, HEIC and GIF — free, instant, no account needed.

## Summary

Optimising your images is the single most impactful performance improvement for most websites:
- Faster page load times
- Better Google rankings through Core Web Vitals
- Lower bandwidth costs
- Better user experience on mobile

Start by compressing your largest images. Even a basic pass at 80% quality will typically cut 60–70% of image file sizes with no visible quality difference.
    `.trim(),
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRecentPosts(exclude?: string, limit = 3): BlogPost[] {
  return blogPosts.filter((p) => p.slug !== exclude).slice(0, limit);
}
