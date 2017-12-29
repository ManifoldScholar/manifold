import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Share from "./Share";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

export default class AnnotationPopupSecondaryWrapper extends PureComponent {
  static displayName = "Annotation.Popup.Secondary.Wrapper";

  static propTypes = {
    direction: PropTypes.string,
    secondary: PropTypes.string,
    selection: PropTypes.object,
    back: PropTypes.func,
    cite: PropTypes.func,
    text: PropTypes.object,
    section: PropTypes.object
  };

  constructor() {
    super();
    this.secondaryPageTransitionTime = 300;
  }

  renderContents() {
    switch (this.props.secondary) {
      case "share":
        return (
          <Share
            selection={this.props.selection}
            direction={this.props.direction}
            back={this.props.back}
            cite={this.props.cite}
            text={this.props.text}
            section={this.props.section}
          />
        );
      default:
        return null;
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        transitionName="page"
        transitionEnterTimeout={this.secondaryPageTransitionTime}
        transitionLeaveTimeout={this.secondaryPageTransitionTime}
        component="div"
        className="popup-page-secondary-group"
      >
        {this.renderContents()}
      </ReactCSSTransitionGroup>
    );
  }
}
