import { useState, useCallback, useMemo, Children, cloneElement } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import classnames from "classnames";
import { FocusTrap } from "focus-trap-react";
import isString from "lodash/isString";
import IconComposer from "global/components/utility/IconComposer";
import BodyClass from "hoc/BodyClass";

export default function DialogWrapper({
  closeUrl,
  closeCallback,
  showCloseButton = true,
  closeOnOverlayClick = true,
  maxWidth,
  className,
  children,
  labelledBy,
  describedBy,
  onEsc
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [additionalClassNames, setAdditionalClassNames] = useState("");

  const overlayRole = useMemo(() => (closeOnOverlayClick ? "button" : null), [
    closeOnOverlayClick
  ]);

  const style = useMemo(() => {
    const styleObj = {};
    if (maxWidth) styleObj.maxWidth = maxWidth;
    return styleObj;
  }, [maxWidth]);

  const setDialogClassName = useCallback(additionalClassNamesValue => {
    setAdditionalClassNames(additionalClassNamesValue);
  }, []);

  const leave = useCallback(callback => {
    setTimeout(callback, 200);
  }, []);

  const closeWithUrlChange = useCallback(() => {
    leave(() => {
      navigate(closeUrl);
    });
  }, [leave, navigate, closeUrl]);

  const closeWithNoAction = useCallback(() => {
    leave(() => {});
  }, [leave]);

  const closeWithCallback = useCallback(() => {
    leave(closeCallback);
  }, [leave, closeCallback]);

  const doClose = useCallback(() => {
    if (closeUrl) return closeWithUrlChange();
    if (closeCallback) return closeWithCallback();
    return closeWithNoAction();
  }, [
    closeUrl,
    closeCallback,
    closeWithUrlChange,
    closeWithCallback,
    closeWithNoAction
  ]);

  const handleOverlayClick = useCallback(
    event => {
      event.stopPropagation();
      if (closeOnOverlayClick) doClose();
    },
    [closeOnOverlayClick, doClose]
  );

  const handleCloseClick = useCallback(
    event => {
      event.stopPropagation();
      doClose();
    },
    [doClose]
  );

  const handleEscape = useCallback(
    e => {
      e.stopPropagation();
      if (onEsc) return onEsc(e);
      return doClose();
    },
    [onEsc, doClose]
  );

  const renderChildren = useCallback(() => {
    if (isString(children.type)) return children;
    if (Children.count(children) !== 1) return children;
    return cloneElement(children, {
      triggerClose: handleCloseClick,
      setDialogClassName
    });
  }, [children, handleCloseClick, setDialogClassName]);

  const output = (
    <BodyClass className={"no-scroll"}>
      <FocusTrap
        focusTrapOptions={{
          escapeDeactivates: handleEscape
        }}
      >
        <div className="dialog-wrapper">
          {/* The <div> element's role is declared dynamically, confusing jsx-a11y */}
          {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
          <div
            className="dialog-overlay"
            onClick={handleOverlayClick}
            role={overlayRole}
          />
          <div
            role="dialog"
            aria-modal
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            className={classnames("dialog", className, additionalClassNames)}
            style={style}
          >
            {showCloseButton ? (
              <button onClick={handleCloseClick} className="dialog__close">
                <IconComposer icon="close16" size={24} />
                <span className="screen-reader-text">{t("modals.close")}</span>
              </button>
            ) : null}
            {renderChildren()}
          </div>
        </div>
      </FocusTrap>
    </BodyClass>
  );

  if (__SERVER__) return output;

  const domTarget = document.getElementById("global-overlay-container");
  return ReactDOM.createPortal(output, domTarget);
}

DialogWrapper.displayName = "Dialog.Wrapper";

DialogWrapper.propTypes = {
  closeUrl: PropTypes.string,
  closeCallback: PropTypes.func,
  showCloseButton: PropTypes.bool,
  closeOnOverlayClick: PropTypes.bool,
  maxWidth: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  labelledBy: PropTypes.string,
  describedBy: PropTypes.string,
  onEsc: PropTypes.func
};
