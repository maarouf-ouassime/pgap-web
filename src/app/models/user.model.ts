import { Group } from './group.model';
import { Permission } from './permission.model';
import { Role } from './role.model';

export interface User {
  id: number;
  firstname?: string;
  lastname?: string;
  email: string;
  password?: string;
  mfaEnabled?: boolean;
  mfaSecret?: string;
  job?: string;
  company?: string;
  organization?: string;
  photo?: string;
  phone?: string;
  country?: string;
  token?: string;
  hIndex?: string;
  nbPublication?: string;
  speciality?: string;
  confirmed?: string;
  confirmedOn?: Date;
  createdAt?: Date;
  roles?: Role[];
  othPermissions?: Permission[];
  groups?: Group[];
}
