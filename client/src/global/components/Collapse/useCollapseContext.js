import { useContext } from "react";
import { CollapseContext } from "helpers/contexts";

export default function useCollapseContext() {
  const context = useContext(CollapseContext);
  if (!context) {
    throw new Error(
      `Collapse components cannot be rendered outside the Collapse wrapper component.`
    );
  }
  return context;
}
