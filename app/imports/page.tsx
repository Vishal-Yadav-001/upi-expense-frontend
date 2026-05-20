"use client";

import React from "react";
import { useQuery } from "@apollo/client/react";
import { GET_IMPORT_BATCHES } from "@/lib/queries";
import { Upload, FileText, CheckCircle2, XCircle, Clock, Trash2, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";

interface ImportBatch {
  id: string;
  originalFileName: string;
  source: string;
  importedCount: number;
  status: string;
  createdAt: string;
}

export default function ImportHistoryPage() {
  const { data, loading, error } = useQuery(GET_IMPORT_BATCHES, {
    variables: { limit: 20 },
    fetchPolicy: "network-only"
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="h-full overflow-y-auto p-6 space-y-8 pb-20"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-accent/10 text-accent rounded-xl border border-accent/20">
          <Upload size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">Import History</h2>
          <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-[0.2em]">Manage your statement batches</p>
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
          <p className="text-[10px] uppercase tracking-widest mt-2 text-foreground/40">Upload a statement from the dashboard to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.importBatches.map((batch: ImportBatch) => (
            <motion.div 
              key={batch.id} 
              variants={item}
              className="bg-card border border-border rounded-2xl p-6 space-y-4 hover:border-accent/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="p-2 bg-white/5 rounded-lg border border-border/50">
                  <FileText size={18} className="text-foreground/60" />
                </div>
                <div className="flex items-center gap-2">
                  {batch.status === "SUCCESS" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-teal bg-teal/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle2 size={10} />
                      Success
                    </span>
                  ) : batch.status === "PROCESSING" ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <Clock size={10} />
                      Processing
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <XCircle size={10} />
                      Failed
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-sm text-foreground line-clamp-1" title={batch.originalFileName}>
                  {batch.originalFileName}
                </h3>
                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider">
                  Source: {batch.source}
                </p>
              </div>

              <div className="pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="p-1 bg-accent/10 rounded">
                    <IndianRupee size={12} className="text-accent" />
                  </div>
                  <span className="text-xs font-bold text-foreground/70">
                    {batch.importedCount} <span className="text-[10px] text-foreground/30 uppercase tracking-tighter">txns</span>
                  </span>
                </div>
                <span className="text-[10px] text-foreground/30 font-bold uppercase tracking-tighter">
                  {new Date(parseInt(batch.createdAt)).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              <button 
                disabled
                className="w-full py-2 bg-destructive/5 hover:bg-destructive/10 border border-destructive/10 rounded-xl text-destructive/40 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group-hover:text-destructive/80 group-hover:border-destructive/20"
              >
                <Trash2 size={12} />
                Delete Batch
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
