import { useState, useEffect, useMemo, useRef } from "react";
import { useUID } from "react-uid";
import { useDropdownNavContext } from "backend/components/layout/SecondaryNav/Projects/context";
import { useLocation } from "react-router-dom";

export default function useMenuState(initialVisible = false, onBlur) {
  const [visible, setVisible] = useState(initialVisible);

  const { setIsExpanded, isExpanded } = useDropdownNavContext() ?? {};

  const id = useUID();

  const disclosureRef = useRef();
  const contentRef = useRef();

  const { pathname } = useLocation();

  const toggleVisible = () => {
    const next = !visible;
    setVisible(next);
    if (setIsExpanded) {
      setIsExpanded(next);
      if (disclosureRef.current) disclosureRef.current.focus();
    }
  };

  function handleBlur(event) {
    const drawer = document.getElementById("drawer-outer");
    if (!contentRef.current || !disclosureRef.current) return;
    if (
      contentRef.current.contains(event.relatedTarget) ||
      disclosureRef.current.contains(event.relatedTarget) ||
      drawer?.contains(event.relatedTarget)
    )
      return;
    // state can optionally be controlled externally
    typeof onBlur === "function" ? onBlur() : setVisible(false);
  }

  function handleKeyDown(event) {
    if (event.key !== "Escape") return;
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

  useEffect(() => {
    if (!isExpanded && visible) setVisible(false);
  }, [visible, isExpanded]);

  useEffect(() => {
    setVisible(false);
  }, [pathname]);

  return state;
}
