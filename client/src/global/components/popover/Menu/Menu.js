import {
  cloneElement,
  useId,
  useRef,
  useEffect,
  useCallback,
  useState
} from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import * as Styled from "./styles";

export default function PopoverMenu({ disclosure, actions }) {
  const id = useId();
  const toggleId = useId();

  const wrapperRef = useRef(null);
  const popoverRef = useRef(null);
  const menuItems = useRef([]);

  const [open, setOpen] = useState(false);

  const Disclosure = cloneElement(disclosure, {
    id: toggleId,
    type: "button",
    "aria-controls": id,
    "aria-haspopup": "menu",
    "aria-expanded": open,
    onClick: () => {
      setOpen(prevOpen => !prevOpen);
      if (disclosure.props.onClick) {
        disclosure.props.onClick();
      }
    }
  });

  useEffect(() => {
    if (popoverRef.current) {
      menuItems.current = [
        ...popoverRef.current.querySelectorAll("[role='menuitem']")
      ];
    }
  }, []);

  const handleKeyDown = useCallback(
    event => {
      let preventDefault = false;
      const currentIndex = menuItems.current.indexOf(event.target);
      const itemCount = menuItems.current.length;

      switch (event.key) {
        case "Escape":
          setOpen(false);
          if (disclosure.ref?.current) {
            disclosure.ref.current.focus();
          }
          preventDefault = true;
          break;
        case "ArrowUp":
          if (currentIndex - 1 >= 0) {
            menuItems.current[currentIndex - 1].focus();
          }
          preventDefault = true;
          break;
        case "ArrowDown":
          if (currentIndex + 1 < itemCount) {
            menuItems.current[currentIndex + 1].focus();
          }
          preventDefault = true;
          break;
        case "Home":
        case "PageUp":
          menuItems.current[0].focus();
          preventDefault = true;
          break;
        case "End":
        case "PageDown":
          menuItems.current[itemCount - 1].focus();
          preventDefault = true;
          break;
        default:
          break;
      }

      if (preventDefault) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [disclosure.ref]
  );

  useEventListener("keydown", handleKeyDown, popoverRef);

  useEffect(() => {
    if (open && menuItems.current.length) {
      menuItems.current[0].focus();
    }
  }, [open]);

  const handleFocusOut = useCallback(event => {
    const el = wrapperRef?.current;

    // Do nothing if new focus is still inside ref
    if (!el || el.contains(event.relatedTarget)) {
      return;
    }

    setOpen(false);
  }, []);

  useEventListener("focusout", handleFocusOut, wrapperRef);
  useOnClickOutside(wrapperRef, () => setOpen(false));

  return (
    <Styled.Wrapper ref={wrapperRef}>
      {Disclosure}
      {!!actions.length && (
        <Styled.Popover
          ref={popoverRef}
          id={id}
          role="menu"
          tabIndex={-1}
          aria-orientation="vertical"
          aria-labelledby={toggleId}
          inert={!open ? "" : undefined}
        >
          {actions.map(
            ({ id: actionId, label, onClick, disabled = false, ...rest }) => (
              <Styled.Button
                key={actionId}
                type="button"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  if (!disabled) {
                    setOpen(false);
                    if (onClick) onClick();
                  }
                }}
                aria-disabled={disabled ? true : undefined}
                {...rest}
              >
                {label}
              </Styled.Button>
            )
          )}
        </Styled.Popover>
      )}
    </Styled.Wrapper>
  );
}
