import { Transform } from 'class-transformer';
import { IsNumber, Max, Min } from 'class-validator';

export class GetAllUsers {
  public limit: number = 100;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  public page: number = 1;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  public offset: number = 0;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  @Max(100)
  public count: number = 5;
}
