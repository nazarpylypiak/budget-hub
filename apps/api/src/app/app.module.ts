import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { HouseholdsModule } from '../households/households.module';
import { CategoriesModule } from '../categories/categories.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { BudgetsModule } from '../budgets/budgets.module';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    HouseholdsModule,
    CategoriesModule,
    TransactionsModule,
    BudgetsModule,
    DashboardModule,
  ],
})
export class AppModule {}
