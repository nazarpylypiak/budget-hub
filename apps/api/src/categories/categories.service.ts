import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCategoryDto, UpdateCategoryDto } from '@budget-hub/shared-types';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(householdId: string) {
    return this.prisma.category.findMany({ where: { householdId }, orderBy: { name: 'asc' } });
  }

  create(householdId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({ data: { ...dto, householdId } });
  }

  update(id: string, householdId: string, dto: UpdateCategoryDto) {
    return this.prisma.category.update({ where: { id, householdId }, data: dto });
  }

  remove(id: string, householdId: string) {
    return this.prisma.category.delete({ where: { id, householdId } });
  }
}
