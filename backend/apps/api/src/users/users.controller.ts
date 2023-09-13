import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetAllUsers } from '../dto/usersGet.dto';
import { UsersService } from './users.service';
import { UsersCreateDto } from '../dto/usersCreate.dto';
import { IUser } from 'shared/src/interfaces/database/user.interface';
import { AppService } from '../app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Request } from 'express';
import { extname } from 'path';

@Controller({
  path: '/api/v1/users',
})
export class UsersController {
  constructor(
    private usersService: UsersService,
    private appService: AppService,
  ) {}

  @Get()
  public async getUsers(@Query() filterQuery: GetAllUsers): Promise<IUser[]> {
    if (filterQuery.count > filterQuery.limit)
      throw new HttpException(
        `You're exceeded available limit of ${filterQuery.limit} users per one request.`,
        HttpStatus.BAD_REQUEST,
      );

    try {
      return this.usersService.getAllUsers(filterQuery);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      limits: {
        fileSize: 5 * 1_048_576,
      },
      fileFilter: (req: Request, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg)$/)) {
          callback(null, true);
        } else {
          callback(
            new HttpException(
              `Unsupported mimetype ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
      storage: memoryStorage(),
    }),
  )
  public async createUser(
    @Headers('Token') tokenHeader: string,
    @Body() userCreateDto: UsersCreateDto,
    @UploadedFile() userPhoto: Express.Multer.File,
  ): Promise<{
    user_id: number;
  }> {
    if (tokenHeader === undefined)
      throw new HttpException('No Token header.', HttpStatus.FORBIDDEN);

    const isValidToken = await this.appService.checkToken(
      tokenHeader,
      userCreateDto.username,
    );

    if (!isValidToken)
      throw new HttpException(
        'Your token is invalid or expired.',
        HttpStatus.FORBIDDEN,
      );

    if (userPhoto === undefined)
      throw new HttpException('No avatar file.', HttpStatus.BAD_REQUEST);

    try {
      return {
        user_id: await this.usersService.createUser(userCreateDto, userPhoto),
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }

  @Get('/:id')
  public async getUser(@Param('id') userId: number): Promise<IUser> {
    try {
      return this.usersService.getUserById(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          error: error.message,
        },
        error.status,
        {
          cause: error,
        },
      );
    }
  }
}
