import { useState, useEffect, useMemo, useRef } from "react";
import { useUID } from "react-uid";

export default function useMenuState(initialVisible = false, onBlur) {
  const [visible, setVisible] = useState(initialVisible);
  const toggleVisible = () => setVisible(!visible);

  const id = useUID();

  const disclosureRef = useRef();
  const contentRef = useRef();

  function handleBlur(event) {
    if (!contentRef.current || !disclosureRef.current) return;
    if (
      contentRef.current.contains(event.relatedTarget) ||
      disclosureRef.current.contains(event.relatedTarget)
    )
      return;
    // state can optionally be controlled externally
    typeof onBlur === "function" ? onBlur() : setVisible(false);
  }

  function handleKeyDown(event) {
    if (event.key !== "Escape" || !visible) return;
    event.preventDefault();
    typeof onBlur === "function" ? onBlur() : setVisible(false);
    if (disclosureRef.current) disclosureRef.current.focus();
  }

  const disclosureProps = {
    ref: disclosureRef,
    type: "button",
    visible,
    "aria-expanded": visible,
    "aria-controls": id,
    onClick: toggleVisible,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown
  };
  const contentProps = {
    ref: contentRef,
    id,
    visible,
    onBlur: handleBlur,
    onKeyDown: handleKeyDown,
    toggleVisible
  };

  const state = useMemo(
    () => ({
      visible,
      disclosureProps,
      contentProps
    }),
    [visible, id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    setVisible(initialVisible);
  }, [initialVisible]);

  return state;
}
