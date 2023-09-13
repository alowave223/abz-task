import { Injectable, Logger } from '@nestjs/common';
import { UserSeederService } from './user/user.service';

@Injectable()
export class SeederService {
  constructor(
    private readonly logger: Logger,
    private readonly userSeederService: UserSeederService,
  ) {}

  public async seed() {
    await this.users()
      .then((completed) => {
        this.logger.debug('Successfuly completed seeding users...');
        return completed;
      })
      .catch((error) => {
        this.logger.error('Failed seeding users...');
        throw error;
      });
  }

  public async users() {
    const userSeedingResponse = await this.userSeederService.create();

    this.logger.debug(`No. of users created: ${userSeedingResponse.length}`);

    return true;
  }
}
