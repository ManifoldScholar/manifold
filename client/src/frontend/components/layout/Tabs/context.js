import { createContext, useContext } from "react";

const TabsContext = createContext(null);

export default TabsContext;

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error(
      `Tabs components cannot be rendered outside the Tabs.Provider component.`
    );
  }
  return context;
}
