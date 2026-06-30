---
name: Luminous Health
colors:
  surface: '#081425'
  surface-dim: '#081425'
  surface-bright: '#2f3a4c'
  surface-container-lowest: '#040e1f'
  surface-container-low: '#111c2d'
  surface-container: '#152031'
  surface-container-high: '#1f2a3c'
  surface-container-highest: '#2a3548'
  on-surface: '#d8e3fb'
  on-surface-variant: '#bdc8d1'
  inverse-surface: '#d8e3fb'
  inverse-on-surface: '#263143'
  outline: '#87929a'
  outline-variant: '#3e484f'
  surface-tint: '#7bd0ff'
  primary: '#8ed5ff'
  on-primary: '#00354a'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#00668a'
  secondary: '#4ae176'
  on-secondary: '#003915'
  secondary-container: '#00b954'
  on-secondary-container: '#004119'
  tertiary: '#c5c9ff'
  on-tertiary: '#131e8c'
  tertiary-container: '#a3abff'
  on-tertiary-container: '#2c37a0'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#6bff8f'
  secondary-fixed-dim: '#4ae176'
  on-secondary-fixed: '#002109'
  on-secondary-fixed-variant: '#005321'
  tertiary-fixed: '#e0e0ff'
  tertiary-fixed-dim: '#bdc2ff'
  on-tertiary-fixed: '#000767'
  on-tertiary-fixed-variant: '#2f3aa3'
  background: '#081425'
  on-background: '#d8e3fb'
  surface-variant: '#2a3548'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '600'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system embodies a premium, futuristic healthcare aesthetic, blending the precision of high-end developer tools with the approachability of modern wellness platforms. The visual narrative is built on the concept of "Illuminated Clarity"—using light and transparency to make complex medical data feel breathable and intuitive.

The style is a refined hybrid of **Glassmorphism** and **Modern SaaS Minimalism**. It utilizes deep, multi-layered backgrounds to provide a sense of infinite depth, while foreground elements appear as suspended "sheets of light." Interactions should feel weightless, utilizing soft blurs and gentle luminescence to guide the user's focus without visual friction.

**Key Principles:**
- **Optical Precision:** Every border and gap is calculated for maximum crispness, reminiscent of high-performance dashboards.
- **Atmospheric Depth:** Usage of background radial gradients to create "light pools" that sit far behind the glass UI layer.
- **Haptic Visuals:** Elements should look touchable and reactive, using subtle glows rather than heavy physical textures.

## Colors

The palette is anchored in a deep, nocturnal spectrum to allow the medical data and glass effects to "pop" with clinical clarity.

- **Foundational Gradients:** The background is never a flat hex. It uses a primary base of `#0F172A` with subtle radial highlights of `#1E293B` in the corners to create a sense of curvature.
- **The Glass Layer:** Surfaces use a semi-transparent white fill (`rgba(255, 255, 255, 0.08)`) which acts as a prism for the background colors.
- **Functional Accents:**
    - **Sky Blue (#38BDF8):** Used for primary actions and "active" health states.
    - **Emerald (#22C55E):** Reserved for positive diagnostics, stability, and "normal" ranges.
    - **Indigo (#818CF8):** Used for secondary data visualizations and specialized metrics.
    - **Rose (#EF4444):** Immediate attention/critical alerts.

## Typography

The typography system prioritizes legibility in high-density data environments. **Inter** provides a clean, neutral foundation for headers and body text, while **Geist** (monospaced/technical) is introduced for labels and medical data values to emphasize the system's precision.

**Style Guidelines:**
- **Hero Headers:** Use tight letter spacing (`-0.04em`) and high font weights for a commanding, premium feel.
- **Contrast:** Maintain high contrast for body text (use `rgba(255, 255, 255, 0.9)`) against the dark glass backgrounds.
- **Labels:** Small labels should use a slightly increased letter spacing and semi-bold weight to ensure readability against blurred backdrops.

## Layout & Spacing

This design system utilizes a **fluid 12-column grid** for desktop and a **4-column grid** for mobile. The layout philosophy is "Centric and Floating"—content should feel like it is floating in the center of the viewport with generous margins.

- **Breakpoints:** Mobile (under 768px), Tablet (768px-1280px), Desktop (1280px+).
- **Rhythm:** All spacing must be a multiple of 4px. 
- **The "Safety Zone":** Main content containers should have a maximum width of 1440px to prevent excessive line lengths on ultra-wide monitors.
- **Padding:** Internal card padding is generous (minimum 24px) to emphasize the "breathable" nature of the glass panels.

## Elevation & Depth

Hierarchy is established through **Backdrop Blur** and **Inner Glows** rather than traditional drop shadows.

- **Base Level:** The dark background gradient.
- **Level 1 (Panels):** `backdrop-filter: blur(25px)` with a 1px solid white stroke at 12% opacity.
- **Level 2 (Modals/Popovers):** `backdrop-filter: blur(40px)` with a 1px solid white stroke at 20% opacity. Add a very soft, large-radius shadow (`box-shadow: 0 20px 50px rgba(0,0,0,0.3)`) to create a floating effect.
- **Edge Treatment:** All glass panels must have a subtle `inner-shadow` or `linear-gradient` stroke that mimics light hitting the top edge of a glass pane.

## Shapes

The shape language is purposefully soft and organic to counteract the "coldness" of the dark tech aesthetic.

- **Standard Containers:** Use `rounded-lg` (16px) for standard cards.
- **Hero Elements:** Use `rounded-xl` (24px to 28px) for large glass panels and dashboard sections.
- **Interactive Elements:** Buttons and tags should utilize highly rounded corners (24px or full pill-shape) to invite interaction.

## Components

### Glass Buttons
Buttons are the primary interaction point. They should feature a subtle gradient fill. On hover, the background blur should decrease slightly while the `box-shadow` gains a soft glow in the primary color (#38BDF8).

### Floating Inputs
Input fields are transparent with a 1px bottom border by default. Upon focus, they expand into a soft glass container with an animated primary-color "glow" surrounding the perimeter.

### Radial Progress Rings
Used for health metrics (heart rate, oxygen, etc.). These should use a thick stroke with a "conic-gradient" and a blurred glow effect that follows the tip of the progress bar, creating a "comet" effect.

### Interactive Health Cards
Cards feature a "light-follow" effect where a subtle radial gradient follows the user's cursor position behind the glass surface.

### Diagnostic Chips
Small, high-contrast labels with semi-transparent backgrounds corresponding to their status color (e.g., a green chip has a 10% green background and 100% green text).