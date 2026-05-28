"use client";

import { useMutation } from "@apollo/client/react";
import { SYNC_AI_PATTERNS, GET_SUMMARIES } from "@/lib/queries";
import { useState } from "react";

export const useSync = () => {
  const [syncAIPatterns, { loading }] = useMutation(SYNC_AI_PATTERNS, {
    refetchQueries: [
      { query: SYNC_AI_PATTERNS }, // Self (if needed)
      "GetDashboardData",
      { query: GET_SUMMARIES, variables: { type: "MONTHLY", limit: 6 } },
      "GetAvailableCategories"
    ],
    awaitRefetchQueries: true,
    onCompleted: (data: any) => {
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
