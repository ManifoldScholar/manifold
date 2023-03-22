import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Citation from "./Citation";
import FromNodes from "global/components/Annotation/Annotation/TextContent/FromNodes";
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

  get selectionTextClassNames() {
    return classNames(
      "annotation-selection__text-container",
      "annotation-selection__text-container--light"
    );
  }

  maybeTruncateSelection() {
    const {
      annotation: { subject }
    } = this.props;
    if (this.props.truncate && subject.length > this.props.truncate) {
      return <FromNodes selection={subject} />;
    }

    return subject;
  }

  renderShareEditor() {
    return <Citation {...this.props} cancel={this.props.closeDrawer} />;
  }

  render() {
    return (
      <div className="annotation-selection">
        <div className={this.selectionTextClassNames}>
          <div className="annotation-selection__container">
            <IconComposer
              icon="socialCite32"
              size="default"
              className="annotation-selection__icon annotation-selection__icon--flipped"
            />
            {this.maybeTruncateSelection()}
          </div>
        </div>
        {this.renderShareEditor(this.props.shareType)}
      </div>
    );
  }
}
