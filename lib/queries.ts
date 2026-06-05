import { gql } from "@apollo/client";

export interface DashboardData {
  me?: {
    id: string;
    name: string | null;
    monthlyBudget: number | null;
  } | null;
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
    me {
      id
      name
      monthlyBudget
    }
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

export const UPDATE_USER_BUDGET = gql`
  mutation UpdateUserBudget($amount: Float!) {
    updateUserBudget(amount: $amount) {
      id
      monthlyBudget
    }
  }
`;

export const GET_IMPORT_BATCHES = gql`
  query GetImportBatches($limit: Int) {
    importBatches(limit: $limit) {
      id
      originalFileName
      source
      transactionCount
      importedCount
      skippedCount
      status
      createdAt
    }
  }
`;

export const ASK_AI = gql`
  mutation AskAI($question: String!, $history: [ChatMessage], $model: String, $apiKey: String) {
    askAI(question: $question, history: $history, model: $model, apiKey: $apiKey) {
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

export interface TransactionsLedgerData {
  transactions: {
    id: string;
    amount: number;
    direction: string;
    date: string;
    status: string;
    payee?: {
      id: string;
      displayName: string;
      category: string;
      normalizedName?: string;
      transactionCount?: number;
    } | null;
  }[];
}

export interface SubscriptionsData {
  detectSubscriptions: {
    payee: {
      id: string;
      displayName: string;
      category: string;
    };
    frequency: string;
    avgAmount: number;
    lastPaidAt?: string | null;
    confidence: number;
    priceChange?: number | null;
  }[];
  upcomingSubscriptions: {
    payee: {
      id: string;
      displayName: string;
      category: string;
    };
    expectedDate: string;
    avgAmount: number;
    confidence: number;
  }[];
  topRecurringPayees: {
    payee: {
      id: string;
      displayName: string;
      category: string;
    };
    transactionCount: number;
    totalAmount: number;
    lastPaidAt?: string | null;
  }[];
}

export const GET_TRANSACTIONS_LEDGER = gql`
  query GetTransactionsLedger($status: TransactionStatus, $direction: TransactionDirection, $fromDate: String, $toDate: String, $limit: Int) {
    transactions(status: $status, direction: $direction, fromDate: $fromDate, toDate: $toDate, limit: $limit) {
      id
      amount
      direction
      date
      status
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

export const GET_SUBSCRIPTIONS = gql`
  query GetSubscriptions($days: Int, $limit: Int) {
    detectSubscriptions(limit: $limit) {
      payee {
        id
        displayName
        category
        normalizedName
        transactionCount
      }
      frequency
      avgAmount
      lastPaidAt
      confidence
      priceChange
    }
    upcomingSubscriptions(days: $days) {
      payee {
        id
        displayName
        category
        normalizedName
        transactionCount
      }
      expectedDate
      avgAmount
      confidence
    }
    topRecurringPayees(limit: $limit) {
      payee {
        id
        displayName
        category
        normalizedName
        transactionCount
      }
      transactionCount
      totalAmount
      lastPaidAt
    }
  }
`;

