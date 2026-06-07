export interface CreateBudgetDto {
  categoryId: string;
  limitAmount: number;
  month: string; // ISO date string, first day of month e.g. "2026-06-01"
}

export interface UpdateBudgetDto extends Partial<CreateBudgetDto> {}

export interface BudgetDto {
  id: string;
  categoryId: string;
  categoryName: string;
  limitAmount: number;
  spentAmount: number;
  month: string;
  householdId: string;
}
