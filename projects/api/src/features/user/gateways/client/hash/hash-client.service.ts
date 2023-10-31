import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashClient {
  async hashValue(params: { value: string }): Promise<string> {
    const { value } = params;

    const salt = 10;
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }

  async compareHash(params: { value: string; hash: string }): Promise<boolean> {
    const { hash, value } = params;

    if (!value || !hash) return false;

    const comparitionResult = await bcrypt.compare(value, hash);

    return comparitionResult;
  }
}
