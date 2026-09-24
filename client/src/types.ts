export type User = {
  id: string;
  name: string;
  email: string;
};

export type Expense = {
  _id: string;
  amount: number;
  category: string;
  date: string;
  note?: string;
};

export type Insight = {
  _id: string;
  content: string;
  updatedAt: string;
};

export type BudgetInputs = {
  income: string;
  savingsGoal: string;
};

export type EmergencyInputs = {
  monthlyExpenses: string;
  currentSavings: string;
  targetMonths: string;
  monthlyContribution: string;
};

export type FinanceSummary = {
  total: number;
  categoryTotals: Record<string, number>;
  monthlyTotals: Record<string, number>;
  highestCategory: {
    name: string;
    amount: number;
  };
};
