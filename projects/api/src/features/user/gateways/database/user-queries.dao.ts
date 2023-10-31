import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDatabaseEntity } from './entities/user.entity';

@Injectable()
export class UserQueriesDAO {
  constructor(
    @InjectRepository(UserDatabaseEntity)
    private userRepository: Repository<UserDatabaseEntity>,
  ) {}

  async getUser(params: { username: string }): Promise<UserDatabaseEntity> {
    const { username } = params;

    try {
      const result = await this.userRepository.findOneByOrFail({ username });
      return result;
    } catch (exception) {
      console.log(exception);
      throw new NotFoundException('User not found'); // throwing http exception directly to save time
    }
  }
}
