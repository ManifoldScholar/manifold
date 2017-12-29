import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "../Button";
import Panel from "../Panel";

export default class AnnotationPopupLink extends PureComponent {
  static displayName = "Annotation.Popup.Link";

  static propTypes = {
    direction: PropTypes.string,
    selectedLink: PropTypes.object,
    textAnnotations: PropTypes.array,
    showAnnotationsInDrawer: PropTypes.func
  };

  handleViewLinkClick = event => {
    event.preventDefault();
    if (!this.props.selectedLink) return null;
    return window.open(this.props.selectedLink.href, "_blank");
  };

  handleShowAnnotationClick = event => {
    event.preventDefault();
    if (!this.props.showAnnotationsInDrawer || !this.props.textAnnotations)
      return null;
    return this.props.showAnnotationsInDrawer(this.props.textAnnotations);
  };

  render() {
    return (
      <Panel primary direction={this.props.direction}>
        <Button
          key={"link"}
          onClick={this.handleViewLinkClick}
          requiredRole="none"
          label="Follow Link"
          iconClass="manicon-arrow-right"
        />
        <Button
          key={"annotation"}
          onClick={this.handleShowAnnotationClick}
          requiredRole="none"
          label={
            this.props.textAnnotations.length > 1
              ? "View Annotations"
              : "View Annotation"
          }
          iconClass="manicon-word-bubble"
        />
      </Panel>
    );
  }
}
