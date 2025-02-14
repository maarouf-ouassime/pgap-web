import { Permission } from './permission.model';
import { Role } from './role.model';
import { User } from './user.model';

export interface Group {
  id: number;
  name: string;
  users: User[];
  roles: Role[];
  otherPermissions: Permission[];
}
