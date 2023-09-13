import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IPosition } from '../interfaces/database/position.interface';

@Entity('positions')
export class PositionEntity implements IPosition {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('text', { name: 'name' })
  name: string;
}
