import React, { useRef } from "react";
import PropTypes from "prop-types";
import PrimaryMenu from "./PrimaryMenu";
import LinkMenu from "./LinkMenu";
import LoginMenu from "./LoginMenu";
import Authorize from "hoc/Authorize";
import usePositioner from "./usePositioner";

export default function AnnotatablePopup(props) {
  const { selectionState, annotatableRef, activeEvent } = props;
  const popupRef = useRef();

  const showLinkMenu = activeEvent?.annotationIds && activeEvent?.link;

  const setPopupRef = el => {
    popupRef.current = props.popupRef?.current || el;
    props.setPopupRef(el);
  };

  const { direction, style } = usePositioner({
    popupRef: popupRef.current,
    locked: false,
    selectionState,
    annotatableRef
  });

  return (
    <div
      ref={setPopupRef}
      style={style}
      className="annotation-popup annotation-popup--visible"
    >
      <Authorize kind="unauthenticated">
        <LoginMenu {...props} direction={direction} visible />
      </Authorize>
      <Authorize kind="any">
        {showLinkMenu ? (
          <LinkMenu {...props} direction={direction} visible />
        ) : (
          <PrimaryMenu
            {...props}
            locked={props.annotationState === "locked"}
            direction={direction}
            visible
          />
        )}
      </Authorize>
    </div>
  );
}

AnnotatablePopup.displayName = "Annotatable.Popup";

AnnotatablePopup.propTypes = {
  annotationState: PropTypes.string,
  selectionState: PropTypes.object,
  annotatableRef: PropTypes.object,
  activeEvent: PropTypes.object,
  setPopupRef: PropTypes.func
};
