import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserQueriesDAO } from './gateways/database/user-queries.dao';
import { UserOperationsDAO } from './gateways/database/user-operations.dao';
import { HashClient } from './gateways/client/hash/hash-client.service';
import { TokenClient } from './gateways/client/token/token-client.service';

export interface TokenPayload {
  userId: number;
  username: string;
}

@Injectable()
export class UserService {
  constructor(
    private userQueriesDAO: UserQueriesDAO,
    private userOperationsDAO: UserOperationsDAO,
    private hashClient: HashClient,
    private tokenClient: TokenClient<TokenPayload>,
  ) {}

  async registerUser(params: {
    username: string;
    password: string;
  }): Promise<void> {
    const { password, username } = params;

    const hashedPassword = await this.hashClient.hashValue({ value: password });

    await this.userOperationsDAO.registerUser({
      password: hashedPassword,
      username,
    });

    return;
  }

  async login(params: { username: string; password: string }): Promise<string> {
    const { password, username } = params;

    const userRecord = await this.userQueriesDAO.getUser({
      username,
    });

    const isAuthenticated = await this.hashClient.compareHash({
      value: password,
      hash: userRecord.password,
    });

    if (!isAuthenticated) {
      throw new UnauthorizedException('Invalid credentials'); // throwing http exception directly to save time
    }

    const token = await this.tokenClient.generateToken({
      payload: { username, userId: userRecord.id },
    });

    return token;
  }
}
