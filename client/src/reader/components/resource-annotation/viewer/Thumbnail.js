import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "frontend/components/resource";

export default class Thumbnail extends PureComponent {
  static displayName = "ResourceAnnotation.Viewer.Thumbnail";

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
    return Resource.Thumbnail.hasImage(this.props.notation, this.variant);
  }

  renderNotation() {
    const { notation, showTitle, neverCrop } = this.props;
    let noCrop = false;
    if (this.hasImage && !neverCrop) noCrop = true;
    return (
      <Resource.Thumbnail
        key={notation.id}
        resource={notation}
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
