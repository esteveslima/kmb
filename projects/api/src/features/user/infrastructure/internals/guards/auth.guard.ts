// Guard that can be used to apply the created authentication

import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { TokenClient } from '../../../gateways/client/token/token-client.service';
import { TokenPayload } from '../../../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(TokenClient)
    private tokenClient: TokenClient<TokenPayload>,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const authPayload = await this.authenticateRequest(req);
    const authData = { ...authPayload };
    req.authData = authData;

    return true;
  }

  private async authenticateRequest(
    req: Request,
  ): Promise<TokenPayload | never> {
    if (!req.headers.authorization) {
      throw new UnauthorizedException('Auth header not found');
    }
    const [, jwtToken] = req.headers.authorization.split(' '); // "Bearer <token>"
    if (!jwtToken) {
      throw new UnauthorizedException('Auth header token not found');
    }

    try {
      const tokenPayload = await this.tokenClient.decodeToken({
        token: jwtToken,
      });
      return tokenPayload;
    } catch (exception) {
      console.log(exception);
      throw new UnauthorizedException('Auth token invalid');
    }
  }
}
