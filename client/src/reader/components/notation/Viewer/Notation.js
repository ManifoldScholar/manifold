import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Resourceish } from "components/frontend";
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

  type() {
    return this.props.notation.type;
  }

  imageAttributeName() {
    return this.type() === "resources" ? "attachmentStyles" : "thumbnailStyles";
  }

  hasImage() {
    const attribute = this.imageAttributeName();
    if (get(this.props.notation, `attributes.${attribute}.smallLandscape`))
      return true;
    if (
      get(
        this.props.notation,
        `attributes.variantThumbnailStyles.smallLandscape`
      )
    )
      return true;
    return false;
  }

  renderNotation() {
    const { notation, additionalClasses, showTitle, neverCrop } = this.props;
    let noCrop = false;
    if (this.hasImage() && !neverCrop) noCrop = true;
    return (
      <Resourceish.Thumbnail
        key={notation.id}
        resourceish={notation}
        showKind={false}
        noCrop={noCrop}
        showTitle={showTitle}
        variant="smallLandscape"
        additionalClasses={additionalClasses}
      />
    );
  }

  render() {
    return this.renderNotation();
  }
}
