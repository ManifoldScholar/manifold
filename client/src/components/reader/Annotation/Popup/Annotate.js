import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HigherOrder from "containers/global/HigherOrder";
import Button from "./Button";
import Panel from "./Panel";

class AnnotationPopupAnnotate extends PureComponent {
  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    attachResource: PropTypes.func.isRequired,
    highlight: PropTypes.func.isRequired,
    annotate: PropTypes.func.isRequired,
    // bookmark: PropTypes.func.isRequired,
    showShare: PropTypes.func.isRequired,
    secondary: PropTypes.string,
    direction: PropTypes.string,
    showLogin: PropTypes.func.isRequired
  };

  render() {
    return (
      <Panel
        primary
        secondary={this.props.secondary}
        direction={this.props.direction}
      >
        <Button
          onClick={this.props.attachResource}
          requiredRole="admin"
          label="Resource"
          iconClass="manicon-cube-outline"
        />

        <Button
          onClick={this.props.highlight}
          requiredRole="any"
          label="Highlight"
          iconClass="manicon-pencil-simple"
        />

        <Button
          onClick={this.props.annotate}
          requiredRole="any"
          label="Annotate"
          iconClass="manicon-word-bubble"
        />

        {/*
        <Buttons.Default
          onClick={this.props.bookmark}
          requiredRole="any"
          label="Bookmark"
          iconClass="manicon-bookmark-outline"
        />
        */}

        <Button
          onClick={this.props.showLogin}
          requiredRole="none"
          label="Login to Annotate"
          iconClass="manicon-person-pencil"
        />

        <Button
          onClick={this.props.showShare}
          requiredRole="any"
          label="Share"
          iconClass="manicon-nodes"
        />
      </Panel>
    );
  }
}

export default HigherOrder.withCurrentUser(AnnotationPopupAnnotate);
