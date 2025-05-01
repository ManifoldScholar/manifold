import { cloneElement } from "react";
import { useDisclosureContext } from "../context";

export default function Toggle({ children }) {
  const { toggleProps } = useDisclosureContext();

  return cloneElement(children, toggleProps);
}

Toggle.displayName = "Disclosure.Toggle";
