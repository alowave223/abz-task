import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MysqlDatabaseProviderModule } from 'shared/src/providers/database/mysql.provider';
import { RedisDatabaseProviderModule } from 'shared/src/providers/database/redis.provider';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PositionEntity } from 'shared/src/entities/position.entity';
import { UserEntity } from 'shared/src/entities/user.entity';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MysqlDatabaseProviderModule,
    RedisDatabaseProviderModule,
    TypeOrmModule.forFeature([PositionEntity, UserEntity]),
    UsersModule,
  ],
  providers: [AppService],
  exports: [AppService],
  controllers: [AppController],
})
export class AppModule {}
