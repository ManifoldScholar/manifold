import React, { PureComponent, PropTypes } from 'react';
import HigherOrder from 'containers/global/HigherOrder';
import Button from './Button';
import Panel from './Panel';

class AnnotationPopupAnnotate extends PureComponent {

  static displayName = "Annotation.Popup.Annotate";

  static propTypes = {
    attachResource: PropTypes.func,
    highlight: PropTypes.func,
    annotate: PropTypes.func,
    bookmark: PropTypes.func,
    showShare: PropTypes.func,
    secondary: PropTypes.string,
    direction: PropTypes.string
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
