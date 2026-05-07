# Align Sidebar and Topbar with Design Spec and Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update Sidebar and Topbar components to use semantic theme variables, correct logo text, and fonts, and integrate them into the main layout replacing the old Header.

**Architecture:** Use CSS variables for colors and fonts to ensure consistency with the theme. Transition the layout to a sidebar-driven dashboard structure.

**Tech Stack:** Next.js, Tailwind CSS (v4), Lucide React.

---

### Task 1: Update Sidebar.tsx

**Files:**
- Modify: `components/layout/Sidebar.tsx`

- [ ] **Step 1: Replace hardcoded colors and update content**
   - Background: `bg-zinc-950` -> `bg-panel`
   - Border: `border-zinc-800` -> `border-border`
   - Logo: `BrainCircuit` -> `UPI Sense`, `text-blue-500` -> `text-accent`
   - Navigation: `bg-zinc-800` -> `bg-accent/10`, `text-blue-500` -> `text-accent`, `bg-zinc-900` -> `bg-white/5`
   - Privacy Toggle: `bg-blue-500` -> `bg-accent`, `text-blue-400` -> `text-accent`
   - Fonts: Add `font-heading` to logo and section titles, `font-sans` to nav items.

```tsx
// Example change for Sidebar.tsx
<div className="flex flex-col h-full bg-panel border-r border-border w-64">
  <div className="p-6">
    <Link href="/" className="flex items-center gap-2 text-white font-heading">
      <BrainCircuit className="w-8 h-8 text-accent" />
      <span className="text-xl font-bold tracking-tight">UPI Sense</span>
    </Link>
  </div>
  {/* ... navigation ... */}
  <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 font-heading">
    {section.title}
  </h3>
  {/* ... item ... */}
  <Link
    key={item.name}
    href={item.href}
    className={cn(
      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors font-sans",
      isActive 
        ? "bg-accent/10 text-white" 
        : "text-zinc-400 hover:text-white hover:bg-white/5"
    )}
  >
  {/* ... privacy button ... */}
  <div className={cn(
    "w-8 h-4 rounded-full relative transition-colors",
    isPrivacyEnabled ? "bg-accent" : "bg-zinc-700"
  )}>
```

- [ ] **Step 2: Commit changes**

```bash
git add components/layout/Sidebar.tsx
git commit -m "style(sidebar): update colors to theme variables and fix logo text"
```

---

### Task 2: Update Topbar.tsx

**Files:**
- Modify: `components/layout/Topbar.tsx`

- [ ] **Step 1: Replace hardcoded colors and fonts**
   - Background: `bg-zinc-950/50` -> `bg-panel/50`
   - Border: `border-zinc-800` -> `border-border`
   - Fonts: `font-heading` for title, `font-sans` for subtext/buttons.
   - Status: `bg-emerald-500` -> `bg-teal`, `text-emerald-500` -> `text-teal`
   - Button: `bg-blue-600` -> `bg-accent`, `shadow-blue-600/20` -> `shadow-accent/20`

```tsx
// Example change for Topbar.tsx
<header className="h-16 border-b border-border bg-panel/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10">
  <div className="flex flex-col">
    <h1 className="text-lg font-bold text-white tracking-tight font-heading">Command Center</h1>
    <p className="text-xs text-zinc-500 font-medium font-sans">Autonomous Financial Engine</p>
  </div>
  {/* ... status ... */}
  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal/10 border border-teal/20">
    <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
    <span className="text-[10px] font-bold uppercase tracking-wider text-teal font-sans">System Online</span>
  </div>
  {/* ... button ... */}
  <button className="flex items-center gap-2 px-4 py-1.5 bg-accent hover:bg-accent/90 text-white rounded-md text-sm font-bold transition-all shadow-lg shadow-accent/20 font-sans">
    <Sparkles className="w-4 h-4" />
    <span>Ask AI</span>
  </button>
```

- [ ] **Step 2: Commit changes**

```bash
git add components/layout/Topbar.tsx
git commit -m "style(topbar): update colors and fonts to match theme"
```

---

### Task 3: Update Root Layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Integrate Sidebar and Topbar, Remove old Header**
   - Import `Sidebar` and `Topbar`.
   - Remove `Header`.
   - Structure: `<div className="flex h-screen overflow-hidden"><Sidebar /><div className="flex-1 flex flex-col overflow-hidden"><Topbar /><main className="flex-1 overflow-y-auto">{children}</main></div></div>`

```tsx
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

// Inside RootLayout body
<PrivacyProvider>
  <ApolloWrapper>
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  </ApolloWrapper>
</PrivacyProvider>
```

- [ ] **Step 2: Verify and Commit**

```bash
git add app/layout.tsx
git commit -m "refactor(layout): switch to sidebar-topbar dashboard structure"
```

---

### Task 4: Final Validation

- [ ] **Step 1: Run Linting**
Run: `npm run lint`
Expected: No errors related to changes.

- [ ] **Step 2: Final Commit**
   - Cleanup any unused imports in `app/layout.tsx`.
