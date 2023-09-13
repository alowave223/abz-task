import { IPosition } from './position.interface';

export interface IUser {
  id?: number;
  username: string;
  email: string;
  phone: string;
  position?: IPosition;
}
