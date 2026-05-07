# Update Global Theme and Fonts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update the global theme variables and fonts to match the new redesign spec.

**Architecture:** Update `globals.css` with new Tailwind v4 theme variables and `layout.tsx` to load Sora and DM Sans fonts via `next/font/google`.

**Tech Stack:** Next.js 15+, Tailwind CSS v4, Google Fonts.

---

### Task 1: Update Global CSS

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `app/globals.css` content with the new theme**

```css
@import "tailwindcss";

@theme {
  --font-sans: var(--font-dm-sans);
  --font-heading: var(--font-sora);

  --color-background: #0d0f14;
  --color-foreground: #f0f2f8;
  
  --color-card: #181c27;
  --color-card-foreground: #f0f2f8;
  
  --color-panel: #13161e;
  --color-border: rgba(255, 255, 255, 0.07);
  --color-accent: #6c7fff;
  --color-accent-soft: rgba(108, 127, 255, 0.12);
  --color-teal: #2ee8b5;
  --color-teal-soft: rgba(46, 232, 181, 0.1);
}

@layer base {
  body {
    @apply bg-background text-foreground font-sans;
  }
}
```

- [ ] **Step 2: Commit changes**

```bash
git add app/globals.css
git commit -m "feat(theme): update global styles with new color palette"
```

### Task 2: Update Root Layout for Fonts

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update imports and font configurations**

```typescript
import type { Metadata, Viewport } from "next";
import { Sora, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/providers/ApolloWrapper";
import { Header } from "@/components/layout/Header";
import { PrivacyProvider } from "@/context/PrivacyContext";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UPI Sense | Smart Expense RAG",
    template: "%s | UPI Sense",
  },
  description: "Analyze your UPI expenses with Gemini-powered RAG",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0f14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <PrivacyProvider>
          <ApolloWrapper>
            <div className="flex flex-col h-screen">
              <Header />
              <main className="flex-1 overflow-hidden">
                {children}
              </main>
            </div>
          </ApolloWrapper>
        </PrivacyProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Successful build without CSS or font errors.

- [ ] **Step 3: Commit changes**

```bash
git add app/layout.tsx
git commit -m "feat(theme): update fonts to Sora and DM Sans"
```
