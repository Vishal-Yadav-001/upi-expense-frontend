"use client";

import { useQuery } from "@apollo/client/react";
import { GET_DASHBOARD_DATA, DashboardData } from "@/lib/queries";

export const useDashboard = () => {
  const { data, loading, error, refetch } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    notifyOnNetworkStatusChange: true,
  });

  return {
    monthlySpend: data?.monthlySpend || [],
    upcomingSubscriptions: data?.upcomingSubscriptions || [],
    categorySpend: data?.totalSpendByCategory || [],
    transactions: data?.transactions || [],
    recentExpenses: data?.recentExpenses || [],
    loading,
    error,
    refetch,
  };
};
