import { Module, Logger } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { UserSeederModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MysqlDatabaseProviderModule } from 'shared/src/providers/database/mysql.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MysqlDatabaseProviderModule,
    UserSeederModule,
  ],
  providers: [Logger, SeederService],
})
export class SeederModule {}
