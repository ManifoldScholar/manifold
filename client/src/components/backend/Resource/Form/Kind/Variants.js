import React, { PureComponent, PropTypes } from 'react';
import { Form } from 'components/backend';

export default class ResourceFormKindVariants extends PureComponent {

  static displayName = "Resource.Form.Kind.Variants";

  static propTypes = {
    kind: PropTypes.string.isRequired
  };

  renderImageFields() {
    const highRes = this.props.sourceModel.attributes.highResUrl ? this.props.sourceModel.attributes.highResUrl : null;
    const thumbnail = this.props.sourceModel.attributes.variantThumbnailStyles ? this.props.sourceModel.attributes.variantThumbnailStyles.smallSquare : null;
    return (
      <div className="form-section">
        <Form.Upload
          style="square"
          label="High Resolution Image"
          accepts="images"
          current={highRes}
          name="attributes[highRes]"
          remove="attributes[removeHighRes]"
          {...this.props}
        />
        <Form.Upload
          style="square"
          label="Thumbnail Image"
          accepts="images"
          current={thumbnail}
          name="attributes[variantThumbnail]"
          remove="attributes[removeVariantThumbnail]"
          {...this.props}
        />
      </div>
    );
  }

  renderVariantFields() {
    const variantOne = this.props.sourceModel.attributes.variantFormatOneFileName ? this.props.sourceModel.attributes.variantFormatOneFileName : null;
    const variantTwo = this.props.sourceModel.attributes.variantFormatTwoFileName ? this.props.sourceModel.attributes.variantFormatTwoFileName : null;
    const variantPoster = this.props.sourceModel.attributes.variantPosterStyles ? this.props.sourceModel.attributes.variantPosterStyles.mediumLandscape : null;
    return (
      <div className="form-section">
        {
          this.props.kind === "video" ?
          <Form.Upload
            style="landscape"
            label="Cover Image"
            accepts="images"
            current={variantPoster}
            name="attributes[variantPoster]"
            remove="attributes[removeVariantPoster]"
            {...this.props}
          />
          : null
        }
        <Form.Upload
          style="square"
          label="Variant"
          accepts={this.props.kind}
          current={variantOne}
          name="attributes[variantFormatOne]"
          remove="attributes[removeVariantFormatOne]"
          {...this.props}
        />
        <Form.Upload
          style="square"
          label="Variant"
          accepts={this.props.kind}
          current={variantTwo}
          name="attributes[variantFormatTwo]"
          remove="attributes[removeVariantFormatTwo]"
          {...this.props}
        />
      </div>
    )
  }

  render() {
    return (
      this.props.kind === "image" ? this.renderImageFields() : this.renderVariantFields()
    )
  }

}

