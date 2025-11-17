import { BakeryDto } from "../bakery/BakeryDto";
import { CakeDto } from "../cake/CakeDto";

export interface MenuItemDto {
  id?: number;
  cake: CakeDto;
  bakery: BakeryDto;
  price: number;
  quantity: number;
}
