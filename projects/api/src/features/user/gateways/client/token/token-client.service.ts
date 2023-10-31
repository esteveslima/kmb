// Helper methods decoupled to be used only internally and not exposed to users

import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenClient<T extends object = Record<string, unknown>> {
  constructor(private jwtService: JwtService) {}

  async decodeToken(params: { token: string }): Promise<T> {
    const { token } = params;

    let decodedTokenPayload: T;
    try {
      decodedTokenPayload = this.jwtService.verify(token);
    } catch (exception) {
      console.log(exception);
      const error = exception as Error;

      const isJwtExpired = error.name === 'TokenExpiredError';
      const isJwtMalformed =
        error.name === 'JsonWebTokenError' || error.name === 'SyntaxError';
      if (isJwtExpired || isJwtMalformed) {
        throw new UnauthorizedException('Invalid credentials'); // throwing http exception directly to save time
      }
      throw new InternalServerErrorException(); // throwing http exception directly to save time
    }

    return decodedTokenPayload;
  }

  async generateToken(params: { payload: T }): Promise<string> {
    const { payload } = params;

    const token = this.jwtService.sign(payload, { expiresIn: 600 });

    return token;
  }
}
