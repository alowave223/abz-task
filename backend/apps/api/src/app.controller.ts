import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { IPosition } from 'shared/src/interfaces/database/position.interface';

@Controller({
  path: '/api/v1/',
})
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/positions')
  public async getPositions(): Promise<IPosition[]> {
    return await this.appService.getPositions();
  }

  @Get('/token')
  public async getToken(@Query('username') username: string): Promise<{
    status: 'success' | 'error';
    token: string;
  }> {
    return {
      status: 'success',
      token: await this.appService.getToken(username),
    };
  }
}
