import { CATEGORY_ICONS } from "@/constants/finance";

export const getIcon = (category: string) => {
  const lowerCat = category?.toLowerCase() || "";
  const key = Object.keys(CATEGORY_ICONS).find(k => lowerCat.includes(k));
  return key ? CATEGORY_ICONS[key] : "💸";
};