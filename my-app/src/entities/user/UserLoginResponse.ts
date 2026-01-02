import { Language } from "./Language";
import { UserRole } from "./UserRole";

export interface UserLoginResponse {
  id: number;
  username: string;
  token: string;
  language: Language;
  role: UserRole;
}
