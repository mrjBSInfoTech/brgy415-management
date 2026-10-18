import { createContext, useContext } from "react";

export const BarangayThemeContext = createContext(null);

export function useBarangayTheme() {
  const context = useContext(BarangayThemeContext);
  if (!context) throw new Error("useBarangayTheme requires BarangayThemeProvider");
  return context;
}
