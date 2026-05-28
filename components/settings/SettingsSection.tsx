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
    <div className="bg-card border border-border rounded-2xl p-6 space-y-5 hover:border-accent/20 transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={cn("p-2.5 rounded-xl border shrink-0", iconClassName)}>
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground tracking-wide text-sm">{title}</h3>
          {description && <p className="text-xs text-foreground/40 font-medium font-sans mt-0.5">{description}</p>}
        </div>
      </div>
      
      <div className="bg-panel/30 border border-border/50 rounded-xl p-4 space-y-4">
        {children}
      </div>
      
      {footer && <div className="px-1 text-[10px] text-foreground/30 font-medium font-sans leading-relaxed">{footer}</div>}
    </div>
  );
}
