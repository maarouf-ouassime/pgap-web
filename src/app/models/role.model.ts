import { Group } from './group.model';
import { Permission } from './permission.model';
import { User } from './user.model';

export interface Role {
  id: number;
  name: string;
  description: string;
  parent_role_id: number;
  users: User[];
  permissions: Permission[];
  groups: Group[];
}
