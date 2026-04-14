import { useId, forwardRef } from "react";
import TrapContent from "./Content";
import * as Styled from "./styles";

const Overlay = forwardRef(function Overlay({ active, onClose, hide }, ref) {
  const uid = useId();

  return (
    <Styled.Dialog
      ref={ref}
      className="bg-neutral90"
      aria-labelledby={uid}
      onClose={onClose}
    >
      {active && <TrapContent uid={uid} hideOverlay={hide} />}
    </Styled.Dialog>
  );
});

export default Overlay;

Overlay.displayName = "Global.SignInUp.Overlay";
