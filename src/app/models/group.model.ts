import {Role} from "./role.model";
import {Permission} from "./permission.model";
import {User} from "./user.model";

export interface Group {
  id: number;
  name: string;
  roles?: Role[];
  otherPermissions?: Permission[];
  users?: User[];
}
