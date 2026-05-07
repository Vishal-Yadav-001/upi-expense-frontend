import { SettingsContainer } from "@/components/settings/SettingsContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight font-heading">Settings</h1>
        <p className="text-sm text-zinc-500 font-sans">
          Configure your UPI Sense experience and manage data privacy.
        </p>
      </div>
      
      <div className="bg-panel border border-border rounded-2xl p-8">
        <SettingsContainer />
      </div>
    </div>
  );
}
