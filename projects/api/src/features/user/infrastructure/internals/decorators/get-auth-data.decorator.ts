import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GetAuthDataPipe } from '../pipes/get-auth-data.pipe';

export const GetAuthData = (data: any = undefined) =>
  createParamDecorator((data: never, context: ExecutionContext) => {
    return context;
  })(data, GetAuthDataPipe);
