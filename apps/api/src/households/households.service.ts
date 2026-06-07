import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HouseholdsService {
  constructor(private readonly prisma: PrismaService) {}

  findMine(householdId: string) {
    return this.prisma.household.findUniqueOrThrow({
      where: { id: householdId },
      include: { users: { select: { id: true, name: true, email: true } } },
    });
  }
}
