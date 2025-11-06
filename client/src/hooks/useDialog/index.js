import { useRef, useState, useEffect, useCallback } from "react";

/**
 * A hook for controlling an HTML <dialog> using React.
 *
 * Usage:
 * ```
 * export default function Dialog() {
 *   const { dialogRef, toggleRef, onToggleClick, onCloseClick } = useDialog({
 *     modal: false,
 *     initOpen: false,
 *     dismissalMode: "light",
 *   });
 *
 *   return (
 *     <>
 *       <button ref={toggleRef} onClick={onToggleClick}>
 *         Open modal
 *       </button>
 *       <dialog ref={dialogRef}>
 *         <button onClick={onCloseClick}>Close</button>
 *         <div>Dialog content</div>
 *       </dialog>
 *     </>
 *   );
 * }
 * ```
 *
 * HTML <dialog> elements require using a specific Web API for controlling modality and focus.
 * Modal dialogs must be opened using `HTMLDialogElement.showModal()`, whereas non-modal dialogs must use `HTMLDialogElement.show()`.
 * This hook tracks state internally, then keys off state changes in an effect to interact with the DOM methods.
 *
 * Modal and non-modal dialogs have distinct behaviors in the browser:
 *
 * Modal dialogs are rendered in the top layer of the DOM, rendering the rest of the DOM inert, and trap focus in the dialog.
 * They also display a `::backdrop` pseudo-element that can be styled with CSS.
 *
 * Non-modal dialogs move focus into the dialog on activation but do not trap focus or make the rest of the DOM inert.
 *
 * Dialogs can also be either dismissed explicitly (by a close button click or Escape key press) or lightly (by click or focus outside).
 * For modal dialogs, explicit dismissal is expected. For non-modal dialogs, light dismissal generally makes sense, but a `dismissalMode` param is provided if explicit dismissal makes sense for a particular use case.
 * Soon we'll have broad support for the `popover` attribute, which will enable the browser's built-in light dismissal functionality.
 *
 * For more information on the <dialog> element, see:
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog
 */
// interface ModalProps {
//   /* Use modal behavior for the dialog. */
//   modal: true;
//   /* Optional class added to <body> element to enable scroll-locking for modal dialogs, which browsers don't do by default */
//   scrollLockClassName?: string;
// }

// interface NonModalProps {
//   /* Don't use modal behavior for the dialog. */
//   modal: false;
//   /* Initialize the dialog in an open state. Defaults to false. */
//   initOpen?: boolean;
//   /* Set supported close functionality: explicit (by a close button click or Escape key press) or light (by click or focus outside). */
//   dismissalMode?: "explicit" | "light";
// }

export default function useDialog(props) {
  const { modal } = props;

  const scrollLockClassName = modal ? props.scrollLockClassName : null;

  // initial open state and light dismissal are incompatible with modal dialog APIs, so we override them if `modal` is `true`.
  const initOpen = !modal ? props.initOpen : false;
  const dismissalMode = !modal ? props.dismissalMode : "explicit";

  const dialogRef = useRef(null);
  const toggleRef = useRef(null);

  const [open, setOpen] = useState(initOpen ?? false);

  const closeDialog = () => setOpen(false);

  // open/close dialog using DOM methods
  useEffect(() => {
    const bodyEl = document.querySelector("body");
    if (!dialogRef.current) return;

    if (open) {
      if (!modal || initOpen) {
        dialogRef.current.show();
      } else {
        dialogRef.current.showModal();
        if (bodyEl && scrollLockClassName) {
          bodyEl.classList.add(scrollLockClassName);
        }
      }
    } else {
      if (dialogRef.current.open) {
        dialogRef.current.close();
      }
      if (
        scrollLockClassName &&
        bodyEl?.classList.contains(scrollLockClassName)
      ) {
        bodyEl.classList.remove(scrollLockClassName);
      }
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // set `open` state to `false` on DOM node close event if not already `false`
  // (to handle browser built-in ESC handling for modal dialogs, and `<form method="dialog">` where the dialog is closed without JS)
  useEffect(() => {
    const currentDialogRef = dialogRef.current;
    if (!currentDialogRef) return;

    currentDialogRef.addEventListener("close", closeDialog);

    return () => {
      if (!currentDialogRef) return;
      currentDialogRef.removeEventListener("close", closeDialog);
    };
  }, []);

  const handleKeyDown = useCallback(event => {
    if (event.key === "Escape") closeDialog();
  }, []);

  const handleFocusOut = useCallback(event => {
    const dialogFocused = event.relatedTarget === dialogRef.current;
    const toggleFocused = event.relatedTarget === toggleRef.current;
    if (!dialogFocused && !toggleFocused) closeDialog();
  }, []);

  // add ESC key dismissal to non-modal dialogs (browser built-in for modal dialogs)
  useEffect(() => {
    const currentDialogRef = dialogRef.current;

    if (modal || !open || !currentDialogRef) return;
    currentDialogRef.addEventListener("keydown", handleKeyDown);

    return () => {
      if (modal || !open || !currentDialogRef) return;
      currentDialogRef.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, modal, handleKeyDown]);

  // support "light" dismissal mode if desired for non-modal browsers (click or focus outside)
  useEffect(() => {
    const currentDialogRef = dialogRef.current;
    if (!currentDialogRef) return;

    if (!open || dismissalMode !== "light") return;
    currentDialogRef.addEventListener("focusout", handleFocusOut);

    return () => {
      if (!open || dismissalMode !== "light") return;
      if (!currentDialogRef) return;
      currentDialogRef.removeEventListener("focusout", handleFocusOut);
    };
  }, [open, dismissalMode, handleFocusOut]);

  return {
    open,
    dialogRef,
    toggleRef,
    onToggleClick: () => setOpen(prevOpen => !prevOpen),
    onCloseClick: () => closeDialog()
  };
}
