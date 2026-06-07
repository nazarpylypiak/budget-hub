import { TransactionType } from './enums';

export interface CreateCategoryDto {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {}

export interface CategoryDto {
  id: string;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
  householdId: string;
}
