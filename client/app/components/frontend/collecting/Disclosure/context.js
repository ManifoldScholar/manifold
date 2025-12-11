import { createContext, useContext } from "react";

const DisclosureContext = createContext(null);

export default DisclosureContext;

export function useDisclosureContext() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error(
      `Disclosure components cannot be rendered outside the Disclosure.Provider component.`
    );
  }
  return context;
}
