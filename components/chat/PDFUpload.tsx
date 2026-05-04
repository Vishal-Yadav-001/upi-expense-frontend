"use client";

import { useState, useRef } from "react";
import { FileUp, Loader2, AlertCircle, X, Shield, ShieldOff } from "lucide-react";
import { usePrivacy } from "@/context/PrivacyContext";
import { getSessionId } from "@/lib/session";

interface PDFUploadProps {
  onUploadSuccess?: (data: { totalParsed?: number }) => void;
}

export const PDFUpload = ({ onUploadSuccess }: PDFUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isPrivacyEnabled, setPrivacyEnabled, hasHydrated } = usePrivacy();
  const inputId = "upi-statement-upload";
  const titleId = "upi-statement-upload-title";
  const descriptionId = "upi-statement-upload-description";

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !hasHydrated) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", "SUPER_MONEY");
    formData.append("storePii", String(!isPrivacyEnabled));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/upload-upi-pdf`, {
        method: "POST",
        body: formData,
        headers: {
          "X-PDF-Source": "SUPER_MONEY",
          "X-Session-ID": getSessionId(),
        },
      });

      const responseText = await response.text();
      let data: { message?: string; totalParsed?: number } | null = null;

      if (responseText) {
        try {
          data = JSON.parse(responseText) as { message?: string; totalParsed?: number };
        } catch {
          data = null;
        }
      }

      if (!response.ok) {
        throw new Error(data?.message || responseText || "Upload failed");
      }

      if (!data) {
        throw new Error("Upload completed but returned an unreadable response");
      }

      if (onUploadSuccess) onUploadSuccess(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-sm animate-in fade-in slide-in-from-top-1"
        >
          <AlertCircle size={16} className="shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} aria-label="Dismiss upload error" className="transition-opacity hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-border bg-background/40">
        <input 
          id={inputId}
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          aria-label="Upload UPI statement PDF"
          aria-labelledby={`${titleId} ${descriptionId}`}
          className="sr-only" 
        />

        <div
          className={`
            relative p-6
            flex flex-col items-center justify-center gap-2
            ${error ? "bg-destructive/5" : ""}
          `}
        >
        {isUploading ? (
          <>
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground/70">Processing statement...</p>
            <p className="text-xs text-foreground/40 text-center">This may take a few seconds as we analyze your transactions.</p>
          </>
        ) : !hasHydrated ? (
          <>
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground/70">Loading Privacy Mode...</p>
            <p className="text-xs text-foreground/40 text-center">Upload will be available as soon as Privacy Mode is ready.</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1">
              <FileUp size={20} />
            </div>
            <p id={titleId} className="text-sm font-medium">Upload UPI Statement</p>
            <p id={descriptionId} className="text-xs text-foreground/40 text-center">Only SuperMoney PDF statements are supported currently</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading || !hasHydrated}
              aria-describedby={descriptionId}
              className={`mt-2 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors transition-opacity ${
                isUploading || !hasHydrated
                  ? "cursor-not-allowed bg-primary/30 text-background/70"
                  : "bg-primary text-background hover:opacity-90"
              }`}
            >
              Choose PDF
            </button>

            <div className="mt-4 w-full max-w-sm rounded-lg border border-border bg-card/40 px-3 py-3">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isPrivacyEnabled ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"}`}>
                  {isPrivacyEnabled ? <Shield size={18} /> : <ShieldOff size={18} />}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-0.5">Privacy Mode</p>
                  <p className="text-sm font-medium">
                    {isPrivacyEnabled ? "On" : "Off"}
                  </p>
                  <p className="text-xs text-foreground/40">
                    Uploaded data and visible names will follow this setting for the current session.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (hasHydrated) {
                      setPrivacyEnabled(!isPrivacyEnabled);
                    }
                  }}
                  disabled={!hasHydrated}
                  aria-label="Toggle Privacy Mode"
                  aria-pressed={hasHydrated ? isPrivacyEnabled : true}
                  className={`relative h-5 w-10 shrink-0 rounded-full transition-colors transition-opacity ${
                    hasHydrated ? (isPrivacyEnabled ? "bg-secondary" : "bg-primary") : "bg-border cursor-not-allowed"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 h-3 w-3 rounded-full bg-white transition-transform ${
                      hasHydrated && isPrivacyEnabled ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
};
