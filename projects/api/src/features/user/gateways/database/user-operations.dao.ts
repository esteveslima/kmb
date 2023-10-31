import { ConflictException, Injectable } from '@nestjs/common';
import { EntityManager, QueryFailedError } from 'typeorm';
import { UserDatabaseEntity } from './entities/user.entity';

@Injectable()
export class UserOperationsDAO {
  constructor(private entityManager: EntityManager) {}

  async registerUser(params: {
    username: string;
    password: string;
  }): Promise<Partial<UserDatabaseEntity>> {
    const { username, password } = params;

    const userInsertRecord: Partial<UserDatabaseEntity> = {
      username,
      password,
    };

    try {
      const insertResult = await this.entityManager.insert(UserDatabaseEntity, [
        userInsertRecord,
      ]);

      const result: Partial<UserDatabaseEntity> = {
        ...userInsertRecord,
        ...insertResult.generatedMaps[0],
      };

      return result;
    } catch (exception) {
      console.log(exception);
      if (exception instanceof QueryFailedError) {
        if (exception.driverError.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('username already exists'); // throwing http exception directly to save time
        }
      }
      throw exception;
    }
  }
}
