import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resourceish from "frontend/components/resourceish";

// The Notation class is used to generate a notation thumbnail, which is currently either
// a resource or a collection. Please do not add any logic to this class that's not
// directly related to rendering the thumbnail. Logic around linking or visibility does
// not belong here.
export default class NotationViewerNotation extends PureComponent {
  static displayName = "NotationViewer.Notation";

  static propTypes = {
    notation: PropTypes.object,
    showTitle: PropTypes.bool,
    neverCrop: PropTypes.bool,
    isPreview: PropTypes.bool
  };

  static defaultProps = {
    showTitle: true,
    neverCrop: false
  };

  get variant() {
    return "smallLandscape";
  }

  get type() {
    return this.props.notation.type;
  }

  hasImage() {
    return Resourceish.Thumbnail.hasImage(this.props.notation, this.variant);
  }

  renderNotation() {
    const { notation, showTitle, neverCrop } = this.props;
    let noCrop = false;
    if (this.hasImage && !neverCrop) noCrop = true;
    return (
      <Resourceish.Thumbnail
        key={notation.id}
        resourceish={notation}
        showKind={false}
        noCrop={noCrop}
        showTitle={showTitle}
        variant={this.variant}
        isPreview={this.props.isPreview}
        minimal
        alignEnd
      />
    );
  }

  render() {
    return this.renderNotation();
  }
}
