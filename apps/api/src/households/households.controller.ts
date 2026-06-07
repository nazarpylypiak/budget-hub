import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HouseholdsService } from './households.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { RequestUser } from '../auth/strategies/jwt.strategy';

@Controller('households')
@UseGuards(AuthGuard('jwt'))
export class HouseholdsController {
  constructor(private readonly households: HouseholdsService) {}

  @Get('mine')
  mine(@CurrentUser() user: RequestUser) {
    return this.households.findMine(user.householdId);
  }
}
