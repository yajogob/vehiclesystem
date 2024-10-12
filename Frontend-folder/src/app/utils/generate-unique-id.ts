export const generateUniqueId = (): string => {
  return new Date().getTime() + '-' + Math.random().toString(36).substring(2, 15);
};
