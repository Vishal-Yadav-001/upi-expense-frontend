import { ImportsContainer } from "@/components/imports/ImportsContainer";
import { Upload } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import History",
  description: "Audit log of processed statement imports, batch statistics, parsed transaction counts, and duplicate upload checks.",
};

export default function ImportHistoryPage() {
  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <Upload size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">Import History</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Audit log of processed statements</p>
        </div>
      </div>

      <ImportsContainer />
    </div>
  );
}
