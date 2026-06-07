import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { DashboardSummaryDto } from '@budget-hub/shared-types';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(
    householdId: string,
    month?: string,
  ): Promise<DashboardSummaryDto> {
    const now = new Date();
    const monthDate = month
      ? new Date(month)
      : new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      1,
    );

    const [transactions, budgets] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { householdId, date: { gte: monthDate, lt: nextMonth } },
        include: { category: { select: { name: true, color: true } } },
      }),
      this.prisma.budget.findMany({
        where: { householdId, month: monthDate },
        include: { category: { select: { name: true, color: true } } },
      }),
    ]);

    const totalIncome = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenseByCategory = new Map<
      string,
      { name: string; color: string | null; amount: number }
    >();
    for (const t of transactions.filter((t) => t.type === 'EXPENSE')) {
      const existing = expenseByCategory.get(t.categoryId);
      if (existing) {
        existing.amount += Number(t.amount);
      } else {
        expenseByCategory.set(t.categoryId, {
          name: t.category.name,
          color: t.category.color,
          amount: Number(t.amount),
        });
      }
    }

    const monthlyTrend = await this.getMonthlyTrend(householdId, 6);

    return {
      month: monthDate.toISOString().slice(0, 7),
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      budgetProgress: budgets.map((b) => {
        const spent = expenseByCategory.get(b.categoryId)?.amount ?? 0;
        return {
          categoryId: b.categoryId,
          categoryName: b.category.name,
          categoryColor: b.category.color,
          limitAmount: Number(b.limitAmount),
          spentAmount: spent,
          percentage:
            Number(b.limitAmount) > 0
              ? Math.round((spent / Number(b.limitAmount)) * 100)
              : 0,
        };
      }),
      expensesByCategory: [...expenseByCategory.entries()].map(
        ([id, data]) => ({
          categoryId: id,
          categoryName: data.name,
          categoryColor: data.color,
          amount: data.amount,
          percentage:
            totalExpenses > 0
              ? Math.round((data.amount / totalExpenses) * 100)
              : 0,
        }),
      ),
      monthlyTrend,
    };
  }

  private async getMonthlyTrend(householdId: string, months: number) {
    const result = [];
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const txs = await this.prisma.transaction.findMany({
        where: { householdId, date: { gte: start, lt: end } },
      });
      result.push({
        month: start.toISOString().slice(0, 7),
        income: txs
          .filter((t) => t.type === 'INCOME')
          .reduce((s, t) => s + Number(t.amount), 0),
        expenses: txs
          .filter((t) => t.type === 'EXPENSE')
          .reduce((s, t) => s + Number(t.amount), 0),
      });
    }
    return result;
  }
}
