"use client";

import { useMutation } from "@apollo/client";
import { SYNC_AI_PATTERNS } from "@/lib/queries";
import { useState } from "react";

export const useSync = () => {
  const [syncAIPatterns, { loading }] = useMutation(SYNC_AI_PATTERNS, {
    refetchQueries: ["GetDashboardData", "GetSummaries", "GetAvailableCategories"],
    onCompleted: (data) => {
      if (data?.syncAIPatterns?.success) {
        console.log(`Sync complete: ${data.syncAIPatterns.updatedTransactions} transactions, ${data.syncAIPatterns.updatedSummaries} summaries.`);
      }
    },
    onError: (error) => {
      console.error("Sync failed:", error);
    }
  });

  const handleSync = async () => {
    try {
      await syncAIPatterns();
    } catch (err) {
      // Handled by onError
    }
  };

  return {
    sync: handleSync,
    isSyncing: loading,
  };
};
