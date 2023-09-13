import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'shared/src/entities/user.entity';
import { IUser } from 'shared/src/interfaces/database/user.interface';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as crypto from 'crypto';
import { PositionEntity } from 'shared/src/entities/position.entity';

@Injectable()
export class UserSeederService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PositionEntity)
    private readonly positionRepository: Repository<PositionEntity>,
  ) {}

  public async create(): Promise<IUser[]> {
    const fakeUsers = [];
    const fakePositions = [
      'User',
      'Developer',
      'Administartor',
      'Designer',
      'Moderator',
    ];

    for (const fakePosition of fakePositions) {
      this.positionRepository
        .findOneBy({
          name: fakePosition,
        })
        .then(async (response) => {
          if (response === null)
            await this.positionRepository.save({
              name: fakePosition,
            });
        });
    }

    for (let i = 0; i < 45; i++) {
      fakeUsers.push({
        username: faker.internet.userName(),
        email: faker.internet.email(),
        phone: faker.phone.number('+380#########'),
        position: Math.floor(Math.random() * 5) + 1,
        photo: crypto.randomBytes(12).toString('hex'),
      });
    }

    await this.userRepository.save(fakeUsers);

    return fakeUsers;
  }
}
