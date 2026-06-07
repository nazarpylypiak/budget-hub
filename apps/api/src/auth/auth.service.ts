import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';
import type { RegisterDto, LoginDto } from '@budget-hub/shared-types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly cfg: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already in use');

    const household = await this.prisma.household.create({ data: { name: dto.householdName } });
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { email: dto.email, password, name: dto.name, householdId: household.id },
    });

    return this.buildTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.buildTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify<JwtPayload>(refreshToken);
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: payload.sub } });
      return this.buildTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private buildTokens(user: { id: string; email: string; name: string; householdId: string }) {
    const payload: JwtPayload = { sub: user.id, householdId: user.householdId };
    const accessToken = this.jwt.sign(payload);
    const refreshToken = this.jwt.sign(payload, {
      expiresIn: this.cfg.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });
    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name, householdId: user.householdId },
    };
  }
}
