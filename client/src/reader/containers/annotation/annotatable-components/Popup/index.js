import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Positioner from "./Positioner";
import PrimaryMenu from "./PrimaryMenu";
import LinkMenu from "./LinkMenu";
import LoginMenu from "./LoginMenu";
import Authorize from "hoc/Authorize";

export default class AnnotatablePopup extends PureComponent {
  static displayName = "Annotatable.Popup";

  static propTypes = {
    annotationState: PropTypes.string,
    selectionState: PropTypes.object,
    annotatableRef: PropTypes.object,
    activeEvent: PropTypes.object,
    setPopupRef: PropTypes.func
  };

  get showLinkMenu() {
    const { activeEvent } = this.props;
    if (!activeEvent) return false;
    return activeEvent.annotationIds && activeEvent.link;
  }

  get visible() {
    const { selection, selectionComplete } = this.props.selectionState;
    return !!(selection && selectionComplete);
  }

  render() {
    return (
      <Positioner
        locked={this.props.annotationState === "locked"}
        selectionState={this.props.selectionState}
        annotatableRef={this.props.annotatableRef}
        setPopupRef={this.props.setPopupRef}
        className={classNames({
          "annotation-popup": true,
          "annotation-popup--visible": this.visible
        })}
      >
        {({ direction }) =>
          this.visible && (
            <>
              <Authorize kind="unauthenticated">
                <LoginMenu
                  {...this.props}
                  direction={direction}
                  visible={this.visible}
                />
              </Authorize>
              <Authorize kind="any">
                {this.showLinkMenu && (
                  <LinkMenu
                    {...this.props}
                    direction={direction}
                    visible={this.visible}
                  />
                )}
                {!this.showLinkMenu && (
                  <PrimaryMenu
                    {...this.props}
                    direction={direction}
                    visible={this.visible}
                  />
                )}
              </Authorize>
            </>
          )
        }
      </Positioner>
    );
  }
}
