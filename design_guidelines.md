# Design Guidelines: CompressYourPhoto

## Design Approach

**Hybrid Approach**: Drawing from **Squoosh** (Google) and **TinyPNG** for simplicity and trust, with **Material Design** principles for interactive components and clear feedback mechanisms. The design prioritizes immediate utility while maintaining a polished, professional aesthetic.

### Core Principles
- **Instant clarity**: Users understand the tool within 2 seconds
- **Progressive disclosure**: Advanced features revealed only when needed
- **Trust through transparency**: Show file sizes, compression ratios, visual comparisons
- **Accessibility-first**: Full keyboard navigation, ARIA labels, screen reader support

---

## Typography

**Font Stack**: Inter (via Google Fonts CDN) for all text
- **Headlines (H1)**: text-4xl md:text-5xl, font-bold, tracking-tight
- **Subheadings (H2)**: text-2xl md:text-3xl, font-semibold
- **Body**: text-base md:text-lg, font-normal, leading-relaxed
- **Labels/UI**: text-sm, font-medium
- **Captions**: text-xs, font-normal

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16, 24** (p-2, m-4, gap-6, etc.)

**Container Strategy**:
- Maximum width: `max-w-7xl mx-auto px-4 md:px-8`
- Section padding: `py-12 md:py-20`
- Component spacing: `space-y-6` for vertical stacking

**Grid System**:
- Upload zone: Full-width, centered
- Features: `grid grid-cols-1 md:grid-cols-3 gap-6`
- Language stats: `grid grid-cols-2 md:grid-cols-4 gap-4`

---

## Component Library

### 1. Hero Section (No Large Image)
A clean, gradient background (subtle) with centered upload zone. No traditional hero image - the upload dropzone IS the hero.

**Structure**:
- Headline + tagline centered above upload zone
- Primary CTA embedded within dropzone: "Drop photos here or click to upload"
- Trust indicators below: "100% client-side • No upload required • Privacy guaranteed"
- Supported formats badge row: JPG, PNG, WebP icons with labels

### 2. Upload Dropzone Component
**Visual Treatment**:
- Large dashed border (border-2 border-dashed)
- Rounded corners (rounded-2xl)
- Generous padding (p-12 md:p-16)
- Icon: Upload cloud (Heroicons) at 64px
- Drag-over state: Border color change + scale transform

### 3. Compression Interface
**Layout**: Split view on desktop (grid grid-cols-1 lg:grid-cols-2)
- **Left**: Original image preview with file details
- **Right**: Compressed preview with new file details
- **Controls between**: Quality slider (0-100), format selector (dropdown), compression mode (radio buttons)
- **Bottom**: Download button + "Compress another" secondary button

### 4. Feature Cards
**3-Column Grid** (stack on mobile):
- **Icon** (Heroicons): Shield (security), Zap (speed), Globe (multilingual)
- **Title**: font-semibold, text-lg
- **Description**: 2-3 lines, text-sm

### 5. Language Switcher
**Fixed position**: top-right corner
- Globe icon + current language code
- Dropdown on click showing all 8 languages with native names
- RTL indicator for Arabic (visual flag or icon)

### 6. Stats/Results Display
**Card-based metrics**:
- Original size → Compressed size (with percentage saved)
- Visual progress bar showing compression ratio
- Time saved indicator
- Grid layout for multiple files

### 7. Footer
**3-Column Layout** (stack on mobile):
- **Left**: Logo + tagline
- **Center**: Quick links (How it works, Privacy, Languages)
- **Right**: Social proof ("Compressed 10M+ photos") + GitHub link

---

## Images

**No large hero image**. Instead:

1. **Feature illustrations** (3 small icons/graphics):
   - Security shield illustration (privacy feature)
   - Speed/lightning bolt graphic (performance feature)
   - Globe with language flags (multilingual feature)
   - Placement: Within feature cards, ~80-100px size

2. **Before/After comparison** (embedded in "How it works" section):
   - Side-by-side image comparison showing quality preservation
   - Slider control between original/compressed
   - File size badges on each side

3. **Format icons** (small, 32px):
   - JPG, PNG, WebP format logos
   - Placed in supported formats row below hero

**Image Implementation**: Use placeholder comments for custom graphics, leverage Heroicons for all standard UI icons.

---

## Interactions & Feedback

**Minimal animations**:
- Upload zone: Scale on drag-over (scale-105)
- Compression progress: Linear progress bar with indeterminate state
- File cards: Subtle slide-in on upload (opacity + translateY)
- Language switcher: Fade dropdown

**States**:
- Idle, Dragging, Processing, Complete, Error
- Each state has distinct visual treatment (border colors, icons, messages)

---

## RTL Support for Arabic

- Entire layout mirrors (flex-row-reverse, text-right)
- Language switcher remains top-right in LTR, top-left in RTL
- Number formatting preserved (file sizes use Western numerals)
- Icons flip appropriately (arrows, chevrons)

---

## Responsive Breakpoints

- **Mobile** (base): Single column, simplified controls
- **Tablet** (md: 768px): 2-column grids, side-by-side comparisons
- **Desktop** (lg: 1024px): Full 3-column layouts, split previews

---

**Accessibility**: Full ARIA labels on upload zones, keyboard-navigable controls, sufficient contrast ratios (WCAG AA), focus indicators on all interactive elements.