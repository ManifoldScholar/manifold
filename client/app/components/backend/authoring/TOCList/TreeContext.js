import { createContext, useContext } from "react";

export const TreeContext = createContext(null);

export const useTreeContext = () => useContext(TreeContext);
