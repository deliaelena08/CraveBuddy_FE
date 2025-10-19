import { Language } from "./Language";
import { UserRole } from "./UserRole";

export interface UserDto {
  id?: number;
  username: string;
  password: string;
  role: UserRole;
  language: Language;
  location: string;
  icon?: string;
}
