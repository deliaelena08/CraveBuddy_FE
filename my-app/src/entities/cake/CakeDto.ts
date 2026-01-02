export interface CakeDto {
  id?: number;

  nameRo: string;
  ingredientsRo: string;
  textureRo: string;
  flavourRo: string;
  provenienceRo: string;

  nameEn?: string;
  ingredientsEn?: string;
  textureEn?: string;
  flavourEn?: string;
  provenienceEn?: string;

  sweetness: number;
}
