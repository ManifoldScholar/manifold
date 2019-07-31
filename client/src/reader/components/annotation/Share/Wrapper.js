import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Citation from "./Citation";
import TruncatedTextContent from "global/components/Annotation/Annotation/TextContent/Truncated";
import IconComposer from "global/components/utility/IconComposer";

export default class AnnotationShareWrapper extends PureComponent {
  static displayName = "Annotation.Share.Wrapper";

  static propTypes = {
    annotation: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func,
    truncate: PropTypes.number,
    shareType: PropTypes.string
  };

  static defaultProps = {
    closeOnSave: true
  };

  constructor(props) {
    super(props);

    this.state = {
      editorOpen: true
    };
  }

  maybeTruncateSelection() {
    const {
      annotation: { subject }
    } = this.props;
    if (this.props.truncate && subject.length > this.props.truncate) {
      return (
        <TruncatedTextContent
          selection={subject}
          truncate={this.props.truncate}
        />
      );
    }

    return subject;
  }

  renderShareEditor() {
    return <Citation {...this.props} cancel={this.props.closeDrawer} />;
  }

  render() {
    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <div className="container">
            <IconComposer
              icon="socialCite32"
              size="default"
              iconClass="selection-text__icon"
            />
            {this.maybeTruncateSelection()}
          </div>
        </div>
        {this.renderShareEditor(this.props.shareType)}
      </div>
    );
  }
}
