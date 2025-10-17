import { useId } from "react";
import Header from "./Header";
import * as Styled from "./styles";

export default function Dialog({ title, children, className, ...dialog }) {
  const headingId = useId();

  return (
    <Styled.Dialog
      ref={dialog.dialogRef}
      aria-labelledby={headingId}
      className={className}
    >
      <Header
        onClose={dialog.onCloseClick}
        title={title}
        headingId={headingId}
      />
      <div className="container-inline-size">
        <Styled.Inner>{children}</Styled.Inner>
      </div>
    </Styled.Dialog>
  );
}
