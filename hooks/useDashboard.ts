"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_DASHBOARD_DATA, UPDATE_USER_BUDGET, DashboardData } from "@/lib/queries";

export const useDashboard = () => {
  const { data, loading, error, refetch } = useQuery<DashboardData>(GET_DASHBOARD_DATA, {
    notifyOnNetworkStatusChange: true,
  });

  const [updateUserBudget] = useMutation(UPDATE_USER_BUDGET, {
    onCompleted: () => {
      refetch();
    },
  });

  const updateBudget = async (amount: number) => {
    return updateUserBudget({
      variables: { amount },
    });
  };

  return {
    monthlyBudget: data?.me?.monthlyBudget || 0,
    monthlySpend: data?.monthlySpend || [],
    upcomingSubscriptions: data?.upcomingSubscriptions || [],
    categorySpend: data?.totalSpendByCategory || [],
    transactions: data?.transactions || [],
    recentExpenses: data?.recentExpenses || [],
    updateBudget,
    loading,
    error,
    refetch,
  };
};
