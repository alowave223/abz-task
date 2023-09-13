import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PositionEntity } from 'shared/src/entities/position.entity';
import { IPosition } from 'shared/src/interfaces/database/position.interface';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(PositionEntity)
    private readonly positionsRepository: Repository<PositionEntity>,
    @InjectRedis()
    private readonly redisConnection: Redis,
  ) {}

  public async getPositions(): Promise<IPosition[]> {
    return await this.positionsRepository.find();
  }

  public async getToken(username: string): Promise<string> {
    const token = crypto.randomBytes(32).toString('hex');

    await this.redisConnection.setex(`sessions:${token}`, 40 * 60, username);

    return token;
  }

  public async checkToken(token: string, username: string): Promise<boolean> {
    const tokenUsername = await this.redisConnection.get(`sessions:${token}`);

    if (tokenUsername === null || tokenUsername !== username) return false;

    await this.redisConnection.del(`session:${token}`);

    return true;
  }
}
