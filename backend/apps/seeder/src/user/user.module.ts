import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'shared/src/entities/user.entity';
import { UserSeederService } from './user.service';
import { PositionEntity } from 'shared/src/entities/position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, PositionEntity])],
  providers: [UserSeederService],
  exports: [UserSeederService],
})
export class UserSeederModule {}
