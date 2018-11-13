import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Button from "../Button";
import Panel from "../Panel";

export default class AnnotationPopupLink extends PureComponent {
  static displayName = "Annotation.Popup.Link";

  static propTypes = {
    visible: PropTypes.bool.isRequired,
    primary: PropTypes.bool.isRequired,
    direction: PropTypes.string.isRequired,
    selectedLink: PropTypes.object.isRequired,
    annotations: PropTypes.array.isRequired,
    showAnnotationsInDrawer: PropTypes.func.isRequired
  };

  static defaultProps = {
    direction: "down",
    visible: true,
    primary: true
  };

  handleViewLinkClick = event => {
    event.preventDefault();
    if (!this.props.selectedLink) return null;
    return window.open(this.props.selectedLink.href, "_blank");
  };

  handleShowAnnotationClick = event => {
    event.preventDefault();
    if (!this.props.showAnnotationsInDrawer || !this.props.annotations)
      return null;
    return this.props.showAnnotationsInDrawer(this.props.annotations);
  };

  render() {
    return (
      <Panel
        direction={this.props.direction}
        visible={this.props.visible}
        primary={this.props.primary}
      >
        <Button
          key={"link"}
          onClick={this.handleViewLinkClick}
          kind="none"
          label="Follow Link"
          iconClass="manicon-arrow-right"
        />
        <Button
          key={"annotation"}
          onClick={this.handleShowAnnotationClick}
          kind="none"
          label={
            this.props.annotations.length > 1
              ? "View Annotations"
              : "View Annotation"
          }
          iconClass="manicon-word-bubble"
        />
      </Panel>
    );
  }
}
