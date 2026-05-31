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
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
      <div className="p-12 border border-border/50 border-dashed rounded-3xl bg-card/25 text-foreground/20 text-center flex flex-col items-center justify-center min-h-[320px] relative overflow-hidden">
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
        
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent/90 text-background rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow-lg shadow-accent/15 hover:shadow-accent/25 hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Upload PDF Statement</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Total Count Pill Overlay */}
      <div className="flex justify-end -mt-16 sm:-mt-20 relative z-20">
        <div className="px-3.5 py-1.5 bg-white/5 border border-border/50 rounded-xl">
          <span className="text-[9px] font-extrabold text-foreground/50 uppercase tracking-widest font-sans">
            {data?.importBatches?.length || 0} Batches Logged
          </span>
        </div>
      </div>

      {/* Audit History Bento Grid */}
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
  );
}
