import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
} from '@nestjs/common';
import { UserService } from '../../user.service';
import { RegisterUserRequestDTO } from './dtos/request/register-user-request.dto';
import { LoginRequestDTO } from './dtos/request/login-request.dto';
import { LoginResponseDTO } from './dtos/response/login-response.dto';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async registerUser(@Body() params: RegisterUserRequestDTO): Promise<void> {
    try {
      const { password, username } = params;

      return await this.userService.registerUser({ password, username });
    } catch (exception) {
      console.log(exception);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new InternalServerErrorException();
    }
  }

  @Post('/login')
  async login(@Body() params: LoginRequestDTO): Promise<LoginResponseDTO> {
    try {
      const { password, username } = params;

      const token = await this.userService.login({
        password,
        username,
      });

      return { token };
    } catch (exception) {
      console.log(exception);
      if (exception instanceof HttpException) {
        throw exception;
      }
      throw new InternalServerErrorException();
    }
  }
}
