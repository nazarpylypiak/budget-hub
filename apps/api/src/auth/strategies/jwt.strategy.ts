import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  householdId: string;
}

export interface RequestUser {
  userId: string;
  householdId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cfg: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: cfg.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload): RequestUser {
    return { userId: payload.sub, householdId: payload.householdId };
  }
}
