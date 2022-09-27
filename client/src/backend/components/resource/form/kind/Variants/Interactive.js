import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindVariantsInteractive extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants.Interactive";

  static propTypes = {
    kind: PropTypes.string
  };

  render() {
    return (
      <>
        <Form.Upload
          layout="landscape"
          label="Poster Image"
          accepts="images"
          readFrom="attributes[variantPosterStyles][small]"
          name="attributes[variantPoster]"
          remove="attributes[removeVariantPoster]"
          {...this.props}
        />
        <Form.Upload
          layout="square"
          label="Thumbnail Image"
          accepts="images"
          readFrom="attributes[variantThumbnailStyles][small]"
          name="attributes[variantThumbnail]"
          remove="attributes[removeVariantThumbnail]"
          {...this.props}
        />
      </>
    );
  }
}
