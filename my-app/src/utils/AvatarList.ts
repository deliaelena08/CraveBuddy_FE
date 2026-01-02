const images = import.meta.glob("/src/assets/avatars/*.png", { eager: true });

export const avatars = Object.values(images).map((mod: any) => mod.default);

export const getAvatarSrc = (avatarPath: string | undefined) => {
  if (!avatarPath) return null;
  if (images[avatarPath]) {
    return (images[avatarPath] as any).default;
  }
  const fullPath = `/src/assets/avatars/${avatarPath}`;
  if (images[fullPath]) {
    return (images[fullPath] as any).default;
  }

  return null;
};
