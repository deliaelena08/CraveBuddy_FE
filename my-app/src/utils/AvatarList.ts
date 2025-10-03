const images = import.meta.glob('/src/assets/avatars/*.png', { eager: true });

export const avatars = Object.values(images).map((mod: any) => mod.default);
