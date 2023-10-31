import { Injectable } from '@nestjs/common';
// import * as bcrypt from 'bcrypt';
/* PS.: 
  Found a very weird bug with bcrypt in the docker environment.
  When the code reaches the line to hash the value the container stops without any error.
  To make things easier only for the purpose of the test, the hashing was replaced with a simple simulation.
*/

@Injectable()
export class HashClient {
  async hashValue(params: { value: string }): Promise<string> {
    const { value } = params;
    const salt = 10;

    // const hash = await bcrypt.hash(value, salt);
    const hash = this.simulateHash(value);

    return hash;
  }

  async compareHash(params: { value: string; hash: string }): Promise<boolean> {
    const { hash, value } = params;

    if (!value || !hash) return false;

    // const comparitionResult = await bcrypt.compare(value, hash);
    const comparitionResult = this.simulateHash(value) === hash;

    return comparitionResult;
  }

  private simulateHash(value: string) {
    return `simulated-hash-${value}`;
  }
}
