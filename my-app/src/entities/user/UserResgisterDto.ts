import { Language } from "./Language";

export interface UserRegisterDto {
  username: string;
  password: string;
  location: string;
  language: Language;
  icon: string;
}
