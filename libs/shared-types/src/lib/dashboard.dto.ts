export interface DashboardSummaryDto {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  budgetProgress: BudgetProgressItem[];
  expensesByCategory: CategoryBreakdownItem[];
  monthlyTrend: MonthlyTrendItem[];
}

export interface BudgetProgressItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  limitAmount: number;
  spentAmount: number;
  percentage: number;
}

export interface CategoryBreakdownItem {
  categoryId: string;
  categoryName: string;
  categoryColor: string | null;
  amount: number;
  percentage: number;
}

export interface MonthlyTrendItem {
  month: string; // "2026-06"
  income: number;
  expenses: number;
}
