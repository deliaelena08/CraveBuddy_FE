import { CakeDto } from "../entities/cake/CakeDto";

export interface DisplayCake {
  name: string;
  ingredients: string;
  texture: string;
  flavour: string;
  provenience: string;
  sweetness: number;
}

export const getLocalizedCake = (
  cake: CakeDto,
  language: string
): DisplayCake => {
  const isRo = language === "ro";

  return {
    name: isRo ? cake.nameRo : cake.nameEn || cake.nameRo,
    ingredients: isRo
      ? cake.ingredientsRo
      : cake.ingredientsEn || cake.ingredientsRo,
    texture: isRo ? cake.textureRo : cake.textureEn || cake.textureRo,
    flavour: isRo ? cake.flavourRo : cake.flavourEn || cake.flavourRo,
    provenience: isRo
      ? cake.provenienceRo
      : cake.provenienceEn || cake.provenienceRo,
    sweetness: cake.sweetness,
  };
};
