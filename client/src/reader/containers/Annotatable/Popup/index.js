import { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import PrimaryMenu from "./PrimaryMenu";
import LinkMenu from "./LinkMenu";
import LoginMenu from "./LoginMenu";
import HighlightMenu from "./HighlightMenu";
import Authorize from "hoc/Authorize";
import usePositioner from "./usePositioner";
import { generateFragmentFromRange } from "../helpers/text-fragments-polyfill/fragment-generation-utils";
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

  const [textFragment, setFragment] = useState("");

  useEffect(() => {
    if (selectionState.selection?.endRange) {
      try {
        const fragment = generateFragmentFromRange(
          selectionState.selection?.allRanges[
            selectionState.selection.allRanges.length - 1
          ]
        );
        setFragment(fragment);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log("There was a text fragment generation error: %o", err);
      }
    }
  }, [selectionState]);

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
            selectionState={{ ...props.selectionState, textFragment }}
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
