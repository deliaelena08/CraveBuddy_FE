import { Language } from "./Language";

export interface UserLoginResponse {
  id: number;
  username: string;
  token: string;
  language: Language;
}
