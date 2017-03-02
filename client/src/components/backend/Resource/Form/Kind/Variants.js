import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindVariants extends PureComponent {

  static displayName = "Resource.Form.Kind.Variants";

  static propTypes = {
    kind: PropTypes.string.isRequired
  };

  renderImageFields() {
    return (
      <div className="form-section">
        <Form.Upload
          style="square"
          label="High Resolution Image"
          accepts="images"
          readfrom="attributes[highResUrl]"
          name="attributes[highRes]"
          remove="attributes[removeHighRes]"
          {...this.props}
        />
        <Form.Upload
          style="square"
          label="Thumbnail Image"
          accepts="images"
          readFrom="attributes[variantThumbnailStyles][smallSquare]"
          name="attributes[variantThumbnail]"
          remove="attributes[removeVariantThumbnail]"
          {...this.props}
        />
      </div>
    );
  }

  renderVariantFields() {
    return (
      <div className="form-section">
        <Form.Upload
          style="square"
          label="Variant"
          accepts={this.props.kind}
          readFrom="attributes[variantFormatOneFileName]"
          name="attributes[variantFormatOne]"
          remove="attributes[removeVariantFormatOne]"
          {...this.props}
        />
        <Form.Upload
          style="square"
          label="Variant"
          accepts={this.props.kind}
          readFrom="attributes[variantFormatTwoFileName]"
          name="attributes[variantFormatTwo]"
          remove="attributes[removeVariantFormatTwo]"
          {...this.props}
        />
        {
          this.props.kind === "video" ?
            <Form.Upload
              style="portrait"
              label="Cover Image"
              accepts="images"
              readFrom="attributes[variantPosterStyles][smallPortrait]"
              name="attributes[variantPoster]"
              remove="attributes[removeVariantPoster]"
              {...this.props}
            />
            : null
        }
      </div>
    );
  }

  render() {
    return (
      this.props.kind === "image" ? this.renderImageFields() : this.renderVariantFields()
    );
  }

}

