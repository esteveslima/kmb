import { IsNotEmpty } from 'class-validator';

export class RegisterUserRequestDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
