import { IsNotEmpty } from 'class-validator';

export class LoginRequestDTO {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
