import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function SettingsSection({ 
  title, 
  description, 
  icon: Icon, 
  iconClassName, 
  children,
  footer 
}: SettingsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg", iconClassName)}>
          <Icon size={18} />
        </div>
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {description && <p className="text-xs text-zinc-500">{description}</p>}
        </div>
      </div>
      <div className="bg-panel/50 border border-border rounded-xl p-4">
        {children}
      </div>
      {footer && <div className="px-1">{footer}</div>}
    </div>
  );
}
