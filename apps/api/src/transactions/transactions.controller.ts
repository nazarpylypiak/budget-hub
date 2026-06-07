import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';
import type { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto } from '@budget-hub/shared-types';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactions: TransactionsService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser, @Query() filter: TransactionFilterDto) {
    return this.transactions.findAll(user.householdId, filter);
  }

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateTransactionDto) {
    return this.transactions.create(user.userId, user.householdId, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactions.update(id, user.householdId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.transactions.remove(id, user.householdId);
  }
}
