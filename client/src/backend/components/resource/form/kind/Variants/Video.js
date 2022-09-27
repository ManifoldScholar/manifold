import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";

export default class ResourceFormKindVariantsVideo extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants.Video";

  static propTypes = {
    kind: PropTypes.string,
    resource: PropTypes.object.isRequired
  };

  get externalVideo() {
    return this.props.resource.attributes.subKind === "external_video";
  }

  render() {
    return (
      <>
        <Form.Upload
          layout="square"
          label="Variant #1"
          accepts={this.props.kind}
          readFrom="attributes[variantFormatOneFileName]"
          name="attributes[variantFormatOne]"
          remove="attributes[removeVariantFormatOne]"
          {...this.props}
        />
        <Form.Upload
          layout="square"
          label="Variant #2"
          accepts={this.props.kind}
          readFrom="attributes[variantFormatTwoFileName]"
          name="attributes[variantFormatTwo]"
          remove="attributes[removeVariantFormatTwo]"
          {...this.props}
        />
        {!this.externalVideo && (
          <Form.Upload
            layout="landscape"
            label="Poster Image"
            accepts="images"
            readFrom="attributes[variantPosterStyles][small]"
            name="attributes[variantPoster]"
            remove="attributes[removeVariantPoster]"
            {...this.props}
          />
        )}
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
