import React, { createContext, useContext, useState } from "react";

export const DropdownNavContext = createContext();

export const useDropdownNavContext = () => {
  const context = useContext(DropdownNavContext);

  return context;
};

export function DropdownNavProvider({ children }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <DropdownNavContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </DropdownNavContext.Provider>
  );
}
