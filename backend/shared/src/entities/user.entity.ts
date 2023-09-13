import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PositionEntity } from './position.entity';
import { IUser } from '../interfaces/database/user.interface';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 60 })
  username: string;

  @Column('varchar', { name: 'email', unique: true })
  email: string;

  @Column('varchar', { name: 'phone', unique: true, length: 13 })
  phone: string;

  @OneToOne(() => PositionEntity, {
    createForeignKeyConstraints: false,
    eager: true,
  })
  @JoinColumn({
    referencedColumnName: 'id',
  })
  position?: PositionEntity;
}
