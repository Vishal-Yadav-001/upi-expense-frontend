"use client";

import { useState, useRef } from "react";
import { FileUp, Loader2, CheckCircle2, AlertCircle, X, Shield, ShieldOff } from "lucide-react";
import { getSessionId } from "@/lib/session";

interface PDFUploadProps {
  onUploadSuccess?: (data: any) => void;
}

export const PDFUpload = ({ onUploadSuccess }: PDFUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState<number>(0);
  const [storePii, setStorePii] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setSuccess(false);
    setImportedCount(0);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("source", "SUPER_MONEY");
    formData.append("storePii", String(storePii));

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/graphql', '') || 'http://localhost:4000';
      const response = await fetch(`${apiUrl}/api/upload-upi-pdf`, {
        method: "POST",
        body: formData,
        headers: {
          "X-PDF-Source": "SUPER_MONEY",
          "X-Session-ID": getSessionId(),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setImportedCount(data.totalParsed || 0);
      setSuccess(true);
      if (onUploadSuccess) onUploadSuccess(data);
      
      // Keep success message visible for 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Something went wrong during upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between p-3 bg-background/40 border border-border rounded-xl">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${storePii ? "bg-primary/10 text-primary" : "bg-secondary/10 text-secondary"}`}>
            {storePii ? <Shield size={18} /> : <ShieldOff size={18} />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-foreground/40 mb-0.5">Privacy Setting</p>
            <p className="text-sm font-medium">{storePii ? "Store Real Names" : "Mask PII on Import"}</p>
          </div>
        </div>
        <button
          onClick={() => setStorePii(!storePii)}
          className={`relative w-10 h-5 rounded-full transition-colors ${storePii ? "bg-primary" : "bg-secondary"}`}
        >
          <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${storePii ? "translate-x-5" : ""}`} />
        </button>
      </div>

      {error && (
        <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive text-sm animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} className="shrink-0" />
          <p className="flex-1">{error}</p>
          <button onClick={() => setError(null)} className="hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-4 text-green-600 dark:text-green-400 text-sm animate-in fade-in slide-in-from-top-2 duration-500 shadow-lg shadow-green-500/5">
          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="font-bold text-base">Statement Processed!</p>
            <p className="opacity-80">Successfully parsed and saved <span className="font-bold underline">{importedCount}</span> transactions to your account.</p>
          </div>
        </div>
      )}

      <div 
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer
          flex flex-col items-center justify-center gap-2
          ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50 hover:bg-primary/5"}
          ${error ? "border-destructive/50" : "border-border"}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".pdf" 
          className="hidden" 
        />
        
        {isUploading ? (
          <>
            <Loader2 size={24} className="animate-spin text-primary" />
            <p className="text-sm font-medium text-foreground/70">Processing statement...</p>
            <p className="text-xs text-foreground/40 text-center">This may take a few seconds as we analyze your transactions.</p>
          </>
        ) : (
          <>
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-1">
              <FileUp size={20} />
            </div>
            <p className="text-sm font-medium">Click to upload UPI Statement</p>
            <p className="text-xs text-foreground/40">Only SuperMoney PDF statements are supported currently</p>
          </>
        )}
      </div>
    </div>
  );
};
