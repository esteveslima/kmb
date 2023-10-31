import { PipeTransform, Injectable, ExecutionContext } from '@nestjs/common';
import { TokenPayload } from '../../../user.service';

@Injectable()
export class GetAuthDataPipe implements PipeTransform {
  async transform(value: ExecutionContext): Promise<TokenPayload> {
    const context = value;
    const req = context.switchToHttp().getRequest();
    const { authData } = req;

    return authData;
  }
}
