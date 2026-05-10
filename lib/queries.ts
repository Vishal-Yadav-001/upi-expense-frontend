import { gql } from "@apollo/client";

export interface DashboardData {
  monthlySpend: {
    month: string;
    total: number;
  }[];
  upcomingSubscriptions: {
    payee: {
      displayName: string;
    };
    expectedDate: string;
    avgAmount: number;
  }[];
  totalSpendByCategory: {
    category: string;
    total: number;
  }[];
  transactions: {
    id: string;
    amount: number;
    direction: string;
    date: string;
    payee: {
      id: string;
      displayName: string;
      category: string;
      normalizedName: string;
      transactionCount: number;
    };
  }[];
  recentExpenses: {
    id: string;
    amount: number;
    direction: string;
    date: string;
    payee: {
      id: string;
      displayName: string;
      category: string;
      normalizedName: string;
      transactionCount: number;
    };
  }[];
}

export const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    monthlySpend {
      month
      total
    }
    upcomingSubscriptions(days: 30) {
      payee {
        displayName
      }
      expectedDate
      avgAmount
    }
    totalSpendByCategory {
      category
      total
    }
    transactions(limit: 10) {
      id
      amount
      direction
      date
      payee {
        id
        displayName
        category
        normalizedName
        transactionCount
      }
    }
    recentExpenses: transactions(limit: 5, direction: DEBIT) {
      id
      amount
      direction
      date
      payee {
        id
        displayName
        category
        normalizedName
        transactionCount
      }
    }
  }
`;

export const CATEGORIZE_PAYEE = gql`
  mutation CategorizePayee($payeeId: ID!, $category: String!) {
    categorizePayee(payeeId: $payeeId, category: $category) {
      id
      category
      confidence
    }
  }
`;

export const ASK_AI = gql`
  mutation AskAI($question: String!, $model: String, $apiKey: String) {
    askAI(question: $question, model: $model, apiKey: $apiKey) {
      answer
      toolsUsed
      data
    }
  }
`;

export const SUBMIT_FEEDBACK = gql`
  mutation SubmitFeedback($input: FeedbackInput!) {
    submitFeedback(input: $input)
  }
`;

export const GET_SUMMARIES = gql`
  query GetSummaries($type: String, $limit: Int) {
    financialSummaries(type: $type, limit: $limit) {
      id
      type
      period
      totalDebit
      totalCredit
      transactionCount
      topCategories {
        category
        amount
      }
      lastUpdated
    }
  }
`;

export const GET_AVAILABLE_CATEGORIES = gql`
  query GetAvailableCategories {
    availableCategories
  }
`;

export const UPDATE_PAYEE_CATEGORY = gql`
  mutation UpdatePayeeCategory($payeeId: ID!, $category: String!) {
    updatePayeeCategory(payeeId: $payeeId, category: $category) {
      id
      category
    }
  }
`;

export const SYNC_AI_PATTERNS = gql`
  mutation SyncAIPatterns {
    syncAIPatterns {
      success
      updatedTransactions
      updatedSummaries
    }
  }
`;
