import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Resource, ResourceCollection } from "components/frontend";
import get from "lodash/get";

// The Notation class is used to generate a notation thumbnail, which is currently either
// a resource or a collection. Please do not add any logic to this class that's not
// directly related to rendering the thumbnail. Logic around linking or visibility does
// not belong here.
export default class NotationViewerNotation extends PureComponent {
  static displayName = "NotationViewer.Notation";

  static propTypes = {
    notation: PropTypes.object,
    additionalClasses: PropTypes.string,
    showTitle: PropTypes.bool,
    neverCrop: PropTypes.bool
  };

  static defaultProps = {
    additionalClasses: "minimal right",
    showTitle: true,
    neverCrop: false
  };

  variant() {
    return "smallLandscape";
  }

  type() {
    return this.props.notation.type;
  }

  imageAttributeName() {
    return this.type() === "resources" ? "attachmentStyles" : "thumbnailStyles";
  }

  hasImage() {
    const attribute = this.imageAttributeName();
    const variant = this.variant();
    return !!get(this.props.notation, `attributes.${attribute}.${variant}`);
  }

  isResource() {
    return this.type() === "resources";
  }

  isCollection() {
    return this.type() === "collections";
  }

  renderResource() {
    const { notation, additionalClasses, showTitle, neverCrop } = this.props;
    let noCrop = false;
    if (this.hasImage() && !neverCrop) noCrop = true;
    return (
      <Resource.Thumbnail
        key={notation.id}
        resource={notation}
        showKind={false}
        noCrop={noCrop}
        showTitle={showTitle}
        variant={this.variant()}
        additionalClasses={additionalClasses}
      />
    );
  }

  renderCollection() {
    const { notation, additionalClasses, showTitle, neverCrop } = this.props;
    let noCrop = false;
    if (this.hasImage() && !neverCrop) noCrop = true;
    return (
      <ResourceCollection.Thumbnail
        key={notation.id}
        resourceCollection={notation}
        noCrop={noCrop}
        showTitle={showTitle}
        variant={this.variant()}
        additionalClasses={additionalClasses}
      />
    );
  }

  render() {
    if (this.isResource()) return this.renderResource();
    if (this.isCollection()) return this.renderCollection();
    return null;
  }
}
