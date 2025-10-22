import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";
import { useTranslation } from "react-i18next";

/**
 * Uses the same styles as the existing dialog, but with native HTML.
 * Eventually this component should fully replace dialog/Wrapper.
 */
export default function Modal({
  id,
  dialog,
  children,
  showCloseButton,
  maxWidth
}) {
  const { t } = useTranslation();

  const handleEsc = e => {
    if (e.key === "Escape") {
      // prevent also exiting full screen in FF
      e.stopPropagation();
      e.preventDefault();
      dialog.onCloseClick();
    }
  };

  const style = {
    ...(maxWidth ? { maxWidth } : {})
  };

  return (
    <Styled.Dialog
      id={id}
      ref={dialog.dialogRef}
      onKeyDown={handleEsc}
      {...(!dialog.open ? { inert: "" } : {})}
    >
      <Styled.Wrapper>
        <div className="dialog" style={style}>
          {showCloseButton ? (
            <button
              onClick={dialog.onCloseClick}
              className="dialog__close"
              aria-controls={id}
            >
              <IconComposer icon="close16" size={24} />
              <span className="screen-reader-text">{t("modals.close")}</span>
            </button>
          ) : null}
          {children}
        </div>
      </Styled.Wrapper>
    </Styled.Dialog>
  );
}

Modal.displayName = "Dialog.Modal";

Modal.propTypes = {
  id: PropTypes.string.isRequired,
  dialog: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  showCloseButton: PropTypes.bool,
  maxWidth: PropTypes.number
};
