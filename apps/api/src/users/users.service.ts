import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findMe(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, householdId: true },
    });
  }

  updateMe(userId: string, data: { name?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, householdId: true },
    });
  }
}
