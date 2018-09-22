import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";

export default class ResourceFormKindVariants extends PureComponent {
  static displayName = "Resource.Form.Kind.Variants";

  static propTypes = {
    kind: PropTypes.string.isRequired
  };

  renderInteractiveFields() {
    return (
      <div className="form-section">
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
      </div>
    );
  }

  renderImageFields() {
    return (
      <div className="form-section">
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
      </div>
    );
  }

  renderPdfFields() {
    return (
      <div className="form-section">
        <Form.Upload
          layout="square"
          label="Thumbnail Image"
          accepts="images"
          readFrom="attributes[variantThumbnailStyles][small]"
          name="attributes[variantThumbnail]"
          remove="attributes[removeVariantThumbnail]"
          {...this.props}
        />
      </div>
    );
  }

  renderVariantFields() {
    return (
      <Form.FieldGroup>
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
        {this.props.kind === "video" ? (
          <Form.Upload
            layout="square"
            label="Thumbnail Image"
            accepts="images"
            readFrom="attributes[variantThumbnailStyles][small]"
            name="attributes[variantThumbnail]"
            remove="attributes[removeVariantThumbnail]"
            {...this.props}
          />
        ) : null}
      </Form.FieldGroup>
    );
  }

  render() {
    if (this.props.kind === "image") return this.renderImageFields();
    if (this.props.kind === "pdf") return this.renderPdfFields();
    if (this.props.kind === "interactive")
      return this.renderInteractiveFields();
    return this.renderVariantFields();
  }
}
