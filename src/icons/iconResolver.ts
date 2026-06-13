import { useCallback } from "react";
import { icons } from "lucide-react";

export const useIconResolver = () => {
  return useCallback(
    (key?: string) => {
      return Object.entries(icons).find(([k]) => k === key) ?? [];
    },
    [icons],
  );
};
