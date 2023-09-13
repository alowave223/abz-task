import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'shared/src/entities/user.entity';
import { Repository } from 'typeorm';
import { GetAllUsers } from '../dto/usersGet.dto';
import { IUser } from 'shared/src/interfaces/database/user.interface';
import { UsersCreateDto } from '../dto/usersCreate.dto';
import { extname, join } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async getAllUsers(filterQuery: GetAllUsers): Promise<IUser[]> {
    const users = await this.userRepository.find({
      take: filterQuery.count,
      skip:
        filterQuery.offset +
        filterQuery.count * filterQuery.page -
        filterQuery.count,
    });

    if (users.length < 1)
      throw {
        message: 'No users found by your query.',
        status: HttpStatus.NOT_FOUND,
      };

    return users;
  }

  public async getUserById(userId: number): Promise<IUser> {
    const user = await this.userRepository.findOneBy({
      id: userId,
    });

    if (user === null)
      throw {
        message: 'No users found by your query.',
        status: HttpStatus.NOT_FOUND,
      };

    return user;
  }

  public async createUser(
    createUserDto: UsersCreateDto,
    avatar: Express.Multer.File,
  ): Promise<number> {
    try {
      const user = await this.userRepository.save(
        <IUser>(<unknown>createUserDto),
      );
      const sharpImage = sharp(avatar.buffer);

      sharpImage
        .resize({
          height: 70,
          width: 70,
          fit: 'cover',
        })
        .toFile(
          join(
            __dirname,
            '..',
            'public',
            'avatars',
            `${user.id}${extname(avatar.originalname)}`,
          ),
          (err: any) => {
            if (err)
              throw {
                status: HttpStatus.BAD_REQUEST,
                message: err.message,
              };
          },
        );

      if (user) {
        return user.id;
      } else {
        throw {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error while creating a user.',
        };
      }
    } catch (error) {
      throw {
        status: HttpStatus.CONFLICT,
        message: 'User already exists!',
      };
    }
  }
}
