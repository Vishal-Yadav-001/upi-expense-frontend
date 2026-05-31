import { ImportsContainer } from "@/components/imports/ImportsContainer";
import { Upload } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import History",
  description: "Audit log of processed statement imports, batch statistics, parsed transaction counts, and duplicate upload checks.",
};

export default function ImportHistoryPage() {
  return (
    <div className="h-full overflow-y-auto p-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <ImportsContainer />
    </div>
  );
}
