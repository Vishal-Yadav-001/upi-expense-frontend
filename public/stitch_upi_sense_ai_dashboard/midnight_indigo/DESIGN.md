---
name: Midnight Indigo
colors:
  surface: '#121223'
  surface-dim: '#121223'
  surface-bright: '#38374b'
  surface-container-lowest: '#0c0c1e'
  surface-container-low: '#1a1a2c'
  surface-container: '#1e1e30'
  surface-container-high: '#28283b'
  surface-container-highest: '#333346'
  on-surface: '#e2e0f9'
  on-surface-variant: '#c6c5d5'
  inverse-surface: '#e2e0f9'
  inverse-on-surface: '#2f2f41'
  outline: '#908f9e'
  outline-variant: '#454653'
  surface-tint: '#bdc2ff'
  primary: '#bdc2ff'
  on-primary: '#131e8c'
  primary-container: '#818cf8'
  on-primary-container: '#101b8a'
  inverse-primary: '#4953bc'
  secondary: '#7bd0ff'
  on-secondary: '#00354a'
  secondary-container: '#00a6e0'
  on-secondary-container: '#00374d'
  tertiary: '#45dfa4'
  on-tertiary: '#003825'
  tertiary-container: '#00aa78'
  on-tertiary-container: '#003523'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bdc2ff'
  on-primary-fixed: '#000767'
  on-primary-fixed-variant: '#2f3aa3'
  secondary-fixed: '#c4e7ff'
  secondary-fixed-dim: '#7bd0ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c69'
  tertiary-fixed: '#68fcbf'
  tertiary-fixed-dim: '#45dfa4'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#121223'
  on-background: '#e2e0f9'
  surface-variant: '#333346'
typography:
  h1:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  h3:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.5'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
  currency-lg:
    fontFamily: JetBrains Mono
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1'
  currency-md:
    fontFamily: JetBrains Mono
    fontSize: 18px
    fontWeight: '500'
    lineHeight: '1'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 24px
  margin-page: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 24px
---

## Brand & Style

This design system is engineered for the modern, tech-literate user who views personal finance through a lens of data density and precision. The aesthetic is a fusion of **Corporate Minimalism** and **Developer Utility**, drawing heavy inspiration from high-end productivity tools like Linear and Vercel.

The personality is serious and analytical, yet accessible through soft indigo accents. It avoids the playfulness of traditional consumer fintech in favor of a "command center" feel. Visual priority is given to information hierarchy, utilizing subtle glows and near-black surfaces to create a focused, low-strain environment for financial auditing and UPI transaction management.

## Colors

The palette is anchored by "Midnight," a near-black blue tint that provides deep contrast for white and indigo elements. 

- **Primary Indigo:** Reserved for primary actions, active states, and brand-critical identifiers.
- **Surface Strategy:** We use a three-tier elevation system: `#0a0a0f` for the base background, `#13131f` for primary card containers, and `#1e1e30` for interactive elements like inputs and borders.
- **Functional Colors:** Amber and Red are utilized strictly for status communication (pending/low balance and failed/deleted) to maintain the "serious" tone of the interface.
- **Chart Palette:** A diverse range of vibrant, high-contrast semi-pastels ensures that multi-category spending data remains legible against the dark background.

## Typography

This design system employs a tri-font strategy to differentiate between intent and data type.

- **Headings:** Space Grotesk provides a technical, slightly futuristic edge. Use 700 weight for page titles and 600 for card headings.
- **Body:** Inter is the workhorse for all instructional text and UI labels, ensuring maximum readability at small sizes.
- **Financial Data:** All numbers, transaction amounts, and timestamps must use JetBrains Mono. This monospaced approach ensures columns of numbers align perfectly in lists. 
- **The ₹ Symbol:** Always use the standard Rupee symbol (₹) prefixing currency. It should inherit the weight and color of the accompanying digits but stay in the monospaced face.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** system for desktop (12 columns) and a fluid single-column system for mobile. 

- **Information Density:** Spacing is tighter than average consumer apps to allow more data visibility. Use an 8px base grid.
- **Sidebars:** Navigation is fixed to the left in a slim 240px rail, utilizing a slightly darker shade than the main content area to create a "nested" feel.
- **Grouping:** Use `stack-sm` (8px) for internal card elements (e.g., label + input) and `stack-lg` (24px) for spacing between major sections or cards.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Subtle Glows** rather than traditional heavy drop shadows.

- **Level 0 (Base):** `#0a0a0f` - The "void" layer.
- **Level 1 (Cards/Sections):** `#13131f` - Flat surface with a 1px border of `#1e1e30`.
- **Level 2 (Modals/Overlays):** `#13131f` - Deep 2xl shadow (`0 25px 50px -12px rgba(0,0,0,0.5)`) to pull the element forward.
- **Interactive State:** Active inputs or primary buttons feature a subtle indigo outer glow (`0 0 12px rgba(129, 140, 248, 0.2)`) instead of a traditional shadow.
- **Dividers:** Use 1px solid lines of `#1e1e30`. Avoid using different background colors for table rows; use borders only.

## Shapes

The shape language is refined and consistent, leaning into "Modern Pro" territory.

- **Primary Containers:** Cards and major sections use a **14px** radius.
- **Interactive Elements:** Buttons, text inputs, and select menus use a **12px** radius. This slight difference in rounding creates a "nested" visual logic where smaller items fit comfortably inside larger containers.
- **Tags/Chips:** Use a fully pill-shaped radius (999px) for status indicators to contrast against the more geometric card structure.

## Components

- **Buttons:**
    - **Primary:** Background `#818cf8`, Text `#0a0a0f`. Bold, no border.
    - **Secondary:** Background transparent, Border 1px `#1e1e30`, Text `#818cf8`.
- **Input Fields:** Background `#13131f`, Border 1px `#1e1e30`, Radius 12px. On focus, border changes to `#818cf8` with a subtle glow.
- **Cards:** Background `#13131f`, Border 1px `#1e1e30`, Radius 14px. Padding should be a consistent 24px.
- **Transaction List:** Use JetBrains Mono for the amount (right-aligned). Use a circular icon (32px) for payees with the first letter of their name.
- **KPI Stats:** Large JetBrains Mono numbers. Labels in Inter (12px, Uppercase, 0.05em letter spacing).
- **UPI ID Chips:** Use a subtle indigo tint background (`rgba(129, 140, 248, 0.1)`) with an indigo border for displaying VPA/UPI IDs.