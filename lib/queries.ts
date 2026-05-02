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
      displayName: string;
      category: string;
      normalizedName: string;
    };
  }[];
  recentExpenses: {
    id: string;
    amount: number;
    direction: string;
    date: string;
    payee: {
      displayName: string;
      category: string;
      normalizedName: string;
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
        displayName
        category
        normalizedName
      }
    }
    recentExpenses: transactions(limit: 5, direction: DEBIT) {
      id
      amount
      direction
      date
      payee {
        displayName
        category
        normalizedName
      }
    }
  }
`;

export const ASK_AI = gql`
  mutation AskAI($question: String!) {
    askAI(question: $question) {
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
