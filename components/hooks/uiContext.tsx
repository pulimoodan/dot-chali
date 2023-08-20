"use client";
import { createContext, useContext } from "react";

interface UIEntity {
  toast: {
    show: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
  };
}

export const UIContext = createContext<UIEntity>({
  toast: {
    show: () => {},
    showError: () => {},
  },
});

export const useUIContext = () => useContext(UIContext);
