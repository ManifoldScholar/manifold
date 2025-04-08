import { useCallback, useId, useState } from "react";

export default function useDisclosure(defaultValue) {
  const contentId = useId();

  const [open, setOpen] = useState(!!defaultValue);

  const toggleOpen = useCallback(() => setOpen(x => !x), []);

  const toggleProps = {
    onClick: toggleOpen,
    "aria-controls": contentId,
    "aria-expanded": open
  };

  const contentProps = {
    id: contentId,
    inert: !open ? "" : undefined
  };

  return { open, toggleProps, contentProps };
}
