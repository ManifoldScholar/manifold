import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import PopupPositioner from "./PopupPositioner";
import PopupMenu from "./PopupMenu";

export default class AnnotatablePopup extends PureComponent {
  static displayName = "Annotatable.Popup";

  static propTypes = {
    annotationState: PropTypes.string,
    selectionState: PropTypes.object,
    annotatableRef: PropTypes.object
  };

  render() {
    return (
      <PopupPositioner
        locked={this.props.annotationState === "locked"}
        selectionState={this.props.selectionState}
        annotatableRef={this.props.annotatableRef}
      >
        {({ direction }) => <PopupMenu {...this.props} direction={direction} />}
      </PopupPositioner>
    );
  }
}
