"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_IMPORT_BATCHES } from "@/lib/queries";
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert, 
  ArrowRight, 
  Loader2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { PDFUpload } from "@/components/chat/PDFUpload";

interface ImportBatch {
  id: string;
  originalFileName: string;
  source: string;
  transactionCount: number;
  importedCount: number;
  skippedCount: number;
  status: string;
  createdAt: string;
}

export function ImportsContainer() {
  const [isUploadOpen, setIsUploadOpen] = React.useState(false);
  const { data, loading, error, refetch } = useQuery<any>(GET_IMPORT_BATCHES, {
    variables: { limit: 50 },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  if (loading && !data) {
    return (
      <div className="flex justify-center py-24 flex-col items-center gap-4">
        <Loader2 size={36} className="animate-spin text-accent" />
        <p className="text-xs text-foreground/40 font-medium tracking-wide">Retrieving statement upload history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-card/30 border border-border/50 rounded-2xl text-destructive/80 text-center space-y-4 max-w-lg mx-auto animate-in fade-in">
        <ShieldAlert size={44} strokeWidth={1.5} className="text-destructive animate-pulse" />
        <h3 className="font-heading font-bold text-base text-white">Statement Audit Failed</h3>
        <p className="text-xs text-foreground/60 leading-relaxed font-sans max-w-sm">{error.message}</p>
        <button
          onClick={() => refetch()}
          className="px-5 py-2.5 bg-destructive text-white hover:bg-red-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-destructive/15"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (data?.importBatches?.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch animate-in fade-in duration-300">
        {/* Left 2 cols - Informational card */}
        <div className="lg:col-span-2 p-8 border border-border/50 border-dashed rounded-3xl bg-card/25 text-foreground/20 text-center flex flex-col items-center justify-center min-h-[350px] relative overflow-hidden">
          <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent opacity-30 blur-2xl pointer-events-none" />
          
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="mb-4 text-accent/30 w-14 h-14 rounded-full bg-accent/5 border border-accent/15 flex items-center justify-center shadow-lg shadow-accent/5"
          >
            <FileText size={24} />
          </motion.div>
          
          <p className="text-sm font-bold text-foreground">No imports found.</p>
          <p className="text-[10px] uppercase tracking-widest mt-1.5 text-foreground/30 max-w-xs font-medium font-sans leading-relaxed">
            Upload bank or wallet statements containing periodic bills to seed transaction ledger
          </p>
        </div>

        {/* Right 1 col - Direct upload card */}
        <div className="p-6 bg-card/40 border border-border/50 backdrop-blur-md rounded-3xl shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-heading font-bold text-sm text-white">Upload First Statement</h3>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-0.5 font-sans">Seeding database indexes</p>
          </div>
          <PDFUpload onUploadSuccess={() => refetch()} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dynamic Header Controls */}
      <div className="flex items-center justify-end gap-2.5 mt-0 lg:-mt-20 relative z-20 mb-6 lg:mb-0">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-accent hover:bg-accent/90 border border-accent/20 text-background rounded-xl text-xs font-bold uppercase transition-all shadow-lg shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 cursor-pointer font-sans shrink-0"
        >
          <Upload size={13} className="shrink-0" />
          <span className="hidden xs:inline">Upload Statement</span>
          <span className="inline xs:hidden">Upload</span>
        </button>

        <div className="px-3 py-1.5 bg-white/5 border border-border/50 rounded-xl flex items-center justify-center shrink-0">
          <span className="text-[9px] font-extrabold text-foreground/50 uppercase tracking-widest font-sans flex items-center gap-1">
            <span className="text-accent font-black">{data?.importBatches?.length || 0}</span>
            <span className="hidden xs:inline">Batches Logged</span>
            <span className="inline xs:hidden">Batches</span>
          </span>
        </div>
      </div>

      {/* Main Content Full Width Layout */}
      <div className="w-full">
        
        {/* Audit History Ledger */}
        <div className="space-y-6">
          <div 
            style={{ scrollbarGutter: "stable" }}
            className="bg-card/40 border border-border/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl"
          >
            {/* 1. Desktop HTML Table Audit Ledger */}
            <table className="w-full text-left border-collapse table-fixed hidden md:table">
              <thead>
                <tr className="border-b border-border/30 bg-panel/30">
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest w-[35%]">File Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest w-[15%]">Source</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest w-[20%]">Date Processed</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest w-[20%]">Breakdown</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest w-[10%] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {data?.importBatches.map((batch: ImportBatch) => {
                  const isFailed = batch.status === "FAILED";
                  return (
                    <tr 
                      key={batch.id} 
                      className={cn(
                        "hover:bg-white/[0.01] transition-colors group",
                        isFailed && "bg-destructive/[0.02] hover:bg-destructive/[0.04]"
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 truncate">
                          <FileText size={15} className={cn("transition-colors shrink-0", isFailed ? "text-destructive/40" : "text-foreground/20 group-hover:text-accent")} />
                          <span className={cn(
                            "text-xs font-semibold transition-colors truncate",
                            isFailed ? "text-destructive/70" : "text-foreground/80 group-hover:text-foreground"
                          )} title={batch.originalFileName}>
                            {batch.originalFileName}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-[9px] font-extrabold text-foreground/40 uppercase tracking-wider bg-white/5 border border-border/40 px-2 py-0.5 rounded font-sans">
                          {batch.source}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="text-[10px] text-foreground/50 font-medium font-sans">
                          {new Date(batch.createdAt).toLocaleDateString("en-IN", { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-1.5 font-sans font-medium text-[9px]", isFailed && "opacity-40")}>
                          <span 
                            title="Total transactions found in statement" 
                            className="bg-accent/10 border border-accent/20 text-accent font-extrabold px-1.5 py-0.5 rounded"
                          >
                            {batch.transactionCount} Found
                          </span>
                          
                          <span className="text-foreground/20 font-bold">→</span>
                          
                          <span 
                            title="Newly imported transactions" 
                            className="bg-teal-soft/10 border border-teal/20 text-teal font-extrabold px-1.5 py-0.5 rounded"
                          >
                            {batch.importedCount} New
                          </span>
                          
                          <span className="text-foreground/20 font-bold">|</span>
                          
                          <span 
                            title="Duplicates skipped" 
                            className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded"
                          >
                            {batch.skippedCount} Dup
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 text-right">
                        {batch.status === "SUCCESS" || batch.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal bg-teal-soft/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-teal/15 shadow-sm shadow-teal/5">
                            <CheckCircle2 size={10} />
                            Success
                          </span>
                        ) : batch.status === "PROCESSING" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-amber-500/15">
                            <Clock size={10} className="animate-pulse" />
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-destructive/20 shadow-sm shadow-destructive/5">
                            <XCircle size={10} />
                            Error
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* 2. Mobile Adaptive Card List */}
            <div className="block md:hidden divide-y divide-border/20">
              {data?.importBatches.map((batch: ImportBatch) => {
                const isFailed = batch.status === "FAILED";
                return (
                  <div 
                    key={batch.id} 
                    className={cn(
                      "p-4 space-y-3 hover:bg-white/[0.01] transition-colors",
                      isFailed && "bg-destructive/[0.02]"
                    )}
                  >
                    {/* Top Row: File Name & Status */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText size={15} className={cn("shrink-0", isFailed ? "text-destructive/40" : "text-accent")} />
                        <span className={cn(
                          "text-xs font-semibold truncate",
                          isFailed ? "text-destructive/70" : "text-foreground"
                        )} title={batch.originalFileName}>
                          {batch.originalFileName}
                        </span>
                      </div>
                      <div className="shrink-0 text-right">
                        {batch.status === "SUCCESS" || batch.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-teal bg-teal-soft/10 px-2 py-0.5 rounded-full uppercase border border-teal/15">
                            Success
                          </span>
                        ) : batch.status === "PROCESSING" ? (
                          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full uppercase border border-amber-500/15">
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[8px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full uppercase border border-destructive/20">
                            Error
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Row: Breakdown Badge */}
                    <div className="flex items-center gap-1.5 font-sans font-medium text-[9px]">
                      <span className="bg-accent/10 border border-accent/20 text-accent font-extrabold px-1.5 py-0.5 rounded">
                        {batch.transactionCount} Found
                      </span>
                      <span className="text-foreground/20 font-bold">→</span>
                      <span className="bg-teal-soft/10 border border-teal/20 text-teal font-extrabold px-1.5 py-0.5 rounded">
                        {batch.importedCount} New
                      </span>
                      <span className="text-foreground/20 font-bold">|</span>
                      <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 font-extrabold px-1.5 py-0.5 rounded">
                        {batch.skippedCount} Dup
                      </span>
                    </div>

                    {/* Bottom Row: Source, Date */}
                    <div className="flex items-center justify-between text-[10px] text-foreground/50">
                      <span className="font-extrabold text-foreground/40 uppercase tracking-wider bg-white/5 border border-border/40 px-2 py-0.5 rounded font-sans text-[8px]">
                        {batch.source}
                      </span>
                      <span className="font-sans">
                        {new Date(batch.createdAt).toLocaleDateString("en-IN", { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* Glassmorphic Upload Modal */}
      <AnimatePresence>
        {isUploadOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsUploadOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="relative w-full max-w-lg bg-card/90 border border-border/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl space-y-4 overflow-hidden"
            >
              {/* Decorative radial gradient glow */}
              <div className="absolute inset-0 bg-radial-gradient from-accent/5 via-transparent to-transparent opacity-40 blur-xl pointer-events-none" />

              {/* Header */}
              <div className="flex justify-between items-start relative z-10">
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Upload Statement PDF</h3>
                  <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-0.5 font-sans">Ingest wallet & bank transfers</p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(false)}
                  className="p-1.5 rounded-lg bg-white/5 border border-border/40 hover:bg-white/10 hover:border-white/20 text-foreground/50 hover:text-white transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Uploader */}
              <div className="relative z-10">
                <PDFUpload 
                  onUploadSuccess={() => {
                    refetch();
                    setTimeout(() => {
                      setIsUploadOpen(false);
                    }, 1200);
                  }} 
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
