import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetsService } from './budgets.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';
import type { CreateBudgetDto, UpdateBudgetDto } from '@budget-hub/shared-types';

@Controller('budgets')
@UseGuards(AuthGuard('jwt'))
export class BudgetsController {
  constructor(private readonly budgets: BudgetsService) {}

  @Get()
  findAll(@CurrentUser() user: RequestUser, @Query('month') month?: string) {
    return this.budgets.findAll(user.householdId, month);
  }

  @Post()
  upsert(@CurrentUser() user: RequestUser, @Body() dto: CreateBudgetDto) {
    return this.budgets.upsert(user.householdId, dto);
  }

  @Patch(':id')
  update(@CurrentUser() user: RequestUser, @Param('id') id: string, @Body() dto: UpdateBudgetDto) {
    return this.budgets.update(id, user.householdId, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.budgets.remove(id, user.householdId);
  }
}
