import { useId } from "react";
import Header from "./Header";
import * as Styled from "./styles";
import PropTypes from "prop-types";

export default function Dialog({
  title,
  showTitle,
  size = "lg",
  children,
  ...dialog
}) {
  const headingId = useId();

  return (
    <Styled.Dialog
      ref={dialog.dialogRef}
      aria-labelledby={headingId}
      $size={size}
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

Dialog.propTypes = {
  title: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  size: PropTypes.oneOf(["sm", "lg"])
};
