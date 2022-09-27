import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindVariantsImage extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants.Image";

  static propTypes = {
    kind: PropTypes.string
  };

  render() {
    return (
      <>
        <Form.Upload
          layout="square"
          label="High Resolution Image"
          accepts="images"
          readFrom="attributes[highResUrl]"
          name="attributes[highRes]"
          remove="attributes[removeHighRes]"
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
