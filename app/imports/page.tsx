"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_IMPORT_BATCHES } from "@/lib/queries";
import { Upload, FileText, CheckCircle2, XCircle, Clock, Trash2, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

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

export default function ImportHistoryPage() {
  const { data, loading, error } = useQuery(GET_IMPORT_BATCHES, {
    variables: { limit: 50 },
    fetchPolicy: "network-only"
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
            <Upload size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground">Import History</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Audit log of processed statements</p>
          </div>
        </div>
        <div className="px-4 py-1.5 bg-white/5 border border-border rounded-lg">
          <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest">
            {data?.importBatches?.length || 0} Batches Total
          </span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
          Failed to load import history: {error.message}
        </div>
      ) : data?.importBatches?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-card border border-border rounded-2xl text-foreground/20">
          <FileText size={48} strokeWidth={1} className="mb-4" />
          <p className="text-sm font-medium">No imports found.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-white/[0.02]">
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">File Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Source</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Date Processed</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest">Breakdown (Found → New | Dup)</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-foreground/40 uppercase tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
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
                        <div className="flex items-center gap-3">
                          <FileText size={16} className={cn("transition-colors", isFailed ? "text-destructive/40" : "text-foreground/20 group-hover:text-accent")} />
                          <span className={cn(
                            "text-sm font-medium transition-colors max-w-[300px] truncate",
                            isFailed ? "text-destructive/70" : "text-foreground/80 group-hover:text-foreground"
                          )} title={batch.originalFileName}>
                            {batch.originalFileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-foreground/40 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
                          {batch.source}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-foreground/50 font-sans">
                          {new Date(batch.createdAt).toLocaleDateString(undefined, { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn("flex items-center gap-2 font-mono", isFailed && "opacity-50")}>
                          <span className="text-xs font-bold text-foreground/70" title="Total found in PDF">{batch.transactionCount}</span>
                          <span className="text-foreground/20">→</span>
                          <span className="text-xs font-bold text-teal" title="Newly imported">{batch.importedCount}</span>
                          <span className="text-foreground/20">|</span>
                          <span className="text-xs font-bold text-yellow-500/70" title="Duplicates skipped">{batch.skippedCount}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {batch.status === "SUCCESS" || batch.status === "COMPLETED" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <CheckCircle2 size={10} />
                            Success
                          </span>
                        ) : batch.status === "PROCESSING" ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            <Clock size={10} />
                            Processing
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full uppercase tracking-wider border border-destructive/20 shadow-lg shadow-destructive/5">
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
          </div>
        </div>
      )}
    </motion.div>
  );
}
