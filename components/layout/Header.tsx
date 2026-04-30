import { Settings } from "lucide-react";

export const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-background">
          U
        </div>
        <h1 className="text-xl font-bold tracking-tight">UPI Sense</h1>
      </div>
      <button className="p-2 hover:bg-white/5 rounded-full transition-colors text-foreground/70 hover:text-foreground">
        <Settings size={20} />
      </button>
    </header>
  );
};
