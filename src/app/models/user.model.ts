import { Group } from './group.model';
import { Role } from './role.model';
import { Permission } from './permission.model';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password?: string; // Optionnel car souvent utilisé uniquement pour la création/modification
  authMethode?: string;
  enabled: boolean;
  secret?: string;
  resetToken?: string;
  resetTokenCreationTime?: Date;
  groups?: Group[];
  roles?: Role[];
  otherPermissions?: Permission[];
}
