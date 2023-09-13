import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
