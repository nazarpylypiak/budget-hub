import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto } from '@budget-hub/shared-types';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(householdId: string, filter: TransactionFilterDto) {
    return this.prisma.transaction.findMany({
      where: {
        householdId,
        ...(filter.categoryId && { categoryId: filter.categoryId }),
        ...(filter.type && { type: filter.type }),
        ...(filter.startDate || filter.endDate
          ? { date: { gte: filter.startDate ? new Date(filter.startDate) : undefined, lte: filter.endDate ? new Date(filter.endDate) : undefined } }
          : {}),
      },
      include: { category: { select: { name: true } } },
      orderBy: { date: 'desc' },
    });
  }

  create(userId: string, householdId: string, dto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: { ...dto, date: new Date(dto.date), userId, householdId },
      include: { category: { select: { name: true } } },
    });
  }

  update(id: string, householdId: string, dto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id, householdId },
      data: { ...dto, ...(dto.date && { date: new Date(dto.date) }) },
      include: { category: { select: { name: true } } },
    });
  }

  remove(id: string, householdId: string) {
    return this.prisma.transaction.delete({ where: { id, householdId } });
  }
}
