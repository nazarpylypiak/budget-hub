import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateBudgetDto, UpdateBudgetDto } from '@budget-hub/shared-types';

@Injectable()
export class BudgetsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(householdId: string, month?: string) {
    const monthDate = month ? new Date(month) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return this.prisma.budget.findMany({
      where: { householdId, month: monthDate },
      include: { category: { select: { name: true, color: true } } },
    });
  }

  upsert(householdId: string, dto: CreateBudgetDto) {
    const month = new Date(dto.month);
    return this.prisma.budget.upsert({
      where: { categoryId_householdId_month: { categoryId: dto.categoryId, householdId, month } },
      create: { categoryId: dto.categoryId, householdId, limitAmount: dto.limitAmount, month },
      update: { limitAmount: dto.limitAmount },
      include: { category: { select: { name: true, color: true } } },
    });
  }

  update(id: string, householdId: string, dto: UpdateBudgetDto) {
    return this.prisma.budget.update({
      where: { id, householdId },
      data: { ...(dto.limitAmount !== undefined && { limitAmount: dto.limitAmount }) },
      include: { category: { select: { name: true, color: true } } },
    });
  }

  remove(id: string, householdId: string) {
    return this.prisma.budget.delete({ where: { id, householdId } });
  }
}
