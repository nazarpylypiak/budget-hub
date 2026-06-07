import { TransactionType } from './enums';

export interface CreateTransactionDto {
  amount: number;
  description?: string;
  date: string; // ISO date string
  type: TransactionType;
  categoryId: string;
}

export interface UpdateTransactionDto extends Partial<CreateTransactionDto> {}

export interface TransactionDto {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: TransactionType;
  categoryId: string;
  categoryName: string;
  userId: string;
  householdId: string;
}

export interface TransactionFilterDto {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  type?: TransactionType;
}
