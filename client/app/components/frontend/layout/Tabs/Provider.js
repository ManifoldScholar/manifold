import useTabList from "@castiron/hooks/useTabList";
import TabsContext from "./context";

export default function Provider({ children, initActive }) {
  const value = useTabList({
    initActive
  });

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}
