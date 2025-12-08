import { BakeryDto } from "../bakery/BakeryDto";
import { UserDto } from "../user/UserDTO";

export interface FavouriteDto {
  id?: number;
  createdAt: Date;
  user: UserDto;
  bakery: BakeryDto;
}
