import { useRef } from "react";
import PropTypes from "prop-types";
import PrimaryMenu from "./PrimaryMenu";
import LinkMenu from "./LinkMenu";
import LoginMenu from "./LoginMenu";
import HighlightMenu from "./HighlightMenu";
import Authorize from "hoc/Authorize";
import usePositioner from "./usePositioner";
import * as Styled from "./styles";

export default function AnnotatablePopup(props) {
  const {
    selectionState,
    annotatableRef,
    activeEvent,
    activeAnnotation
  } = props;
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
    <Styled.Popup ref={setPopupRef} style={style}>
      <Authorize kind="unauthenticated">
        <LoginMenu {...props} direction={direction} visible />
      </Authorize>
      <Authorize kind="any">
        {/* eslint-disable no-nested-ternary */}
        {showLinkMenu ? (
          <LinkMenu {...props} direction={direction} visible />
        ) : activeAnnotation ? (
          <HighlightMenu {...props} direction={direction} visible />
        ) : (
          <PrimaryMenu
            {...props}
            locked={props.annotationState === "locked"}
            direction={direction}
            visible
          />
        )}
      </Authorize>
    </Styled.Popup>
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
