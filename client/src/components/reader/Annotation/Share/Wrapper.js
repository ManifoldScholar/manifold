import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Share from "./";
import Selection from "../Selection";

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

  handleCloseEditor = () => {
    this.setState({
      editorOpen: false
    });
  };

  maybeTruncateSelection() {
    const {
      annotation: { subject }
    } = this.props;
    if (this.props.truncate && subject.length > this.props.truncate) {
      return (
        <Selection.Truncated
          selection={subject}
          truncate={this.props.truncate}
        />
      );
    }

    return subject;
  }

  renderShareEditor() {
    return <Share.Citation {...this.props} cancel={this.props.closeDrawer} />;
  }

  render() {
    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <div className="container">
            <i className="manicon manicon-quote" aria-hidden="true" />
            {this.maybeTruncateSelection()}
          </div>
        </div>
        {this.renderShareEditor(this.props.shareType)}
      </div>
    );
  }
}
