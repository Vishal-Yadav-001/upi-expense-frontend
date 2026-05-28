import { SettingsContainer } from "@/components/settings/SettingsContainer";
import { Settings as SettingsIcon } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <SettingsIcon size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Control Panel</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Configure Experience & Data limits</p>
        </div>
      </div>
      
      <SettingsContainer />
    </div>
  );
}
