import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import has from "lodash/has";
import Icon from "./Icon";
import * as Styled from "./styles";

class ResourceThumbnail extends Component {
  static displayName = "Resource.Thumbnail";

  static hasImage(resource, variant) {
    return this.imageKey(resource, variant) !== undefined;
  }

  static imageKey(resource, variant) {
    if (!resource) return false;
    const { attributes } = resource;
    const { kind } = attributes;
    const lookups =
      kind === "image"
        ? ["attachmentStyles"]
        : ["variantThumbnailStyles", "variantPosterStyles", "attachmentStyles"];
    return lookups.find(lookup => {
      return has(attributes, `${lookup}.${variant}`);
    });
  }

  static propTypes = {
    resource: PropTypes.object,
    showKind: PropTypes.bool,
    showTitle: PropTypes.bool,
    variant: PropTypes.string,
    noCrop: PropTypes.bool,
    isPreview: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    showKind: true,
    showTitle: false,
    variant: "smallPortrait"
  };

  get resource() {
    return this.props.resource;
  }

  get resourceType() {
    return this.resource.type;
  }

  get resourceKind() {
    const kind = this.resource.attributes.kind;
    return this.props.t(`resources.kinds.${kind}`);
  }

  get variant() {
    return this.props.variant;
  }

  get noCrop() {
    return this.props.noCrop;
  }

  get image() {
    const key = this.constructor.imageKey(this.resource, this.variant);
    if (!key) return null;
    return this.resource.attributes[key][this.variant];
  }

  get altText() {
    const key = this.constructor.imageKey(this.resource, this.variant);
    if (!key) return "";
    if (key === "variantThumbnailStyles")
      return this.resource.attributes.variantThumbnailAltText;
    return this.resource.attributes.kind === "image"
      ? this.resource.attributes.attachmentAltText
      : "";
  }

  get hasImage() {
    return !!this.image;
  }

  get showImage() {
    return this.hasImage && this.noCrop;
  }

  get showBackgroundImage() {
    return this.hasImage && !this.noCrop;
  }

  get backgroundImage() {
    if (!this.showBackgroundImage) return null;
    return `url(${this.image})`;
  }

  get caption() {
    const t = this.props.t;
    let out = t("glossary.file_title_case_one");
    switch (this.resourceType) {
      case "resources":
        if (!this.resourceKind) break;
        out = this.resourceKind;
        break;
      case "resourceCollections":
        out = t("glossary.resource_collection_title_case_one");
        break;
      default:
        break;
    }
    return out;
  }

  get wrapperClassName() {
    return classNames({
      "icon-thumbnail-primary": true,
      "bg-neutral90": this.showBackgroundImage
    });
  }

  render() {
    if (!this.resource) return null;

    return (
      <Styled.Wrapper
        $hasBgImage={this.showBackgroundImage}
        $showTitle={this.props.showTitle}
        $alignEnd={this.props.alignEnd}
        $minimal={this.props.minimal}
        $isPreview={this.props.isPreview}
        $iconOnly={this.props.iconOnly}
        className={this.wrapperClassName}
        style={{ backgroundImage: this.backgroundImage }}
      >
        <Styled.Inner>
          <Styled.Figure>
            {this.props.showKind ? (
              <figcaption>{this.caption}</figcaption>
            ) : null}
            {this.showImage ? (
              <Styled.ImageWrapper>
                <Styled.Image src={this.image} alt={this.altText} />
                <Styled.ImageOverlay />
              </Styled.ImageWrapper>
            ) : (
              <Icon resource={this.resource} />
            )}
          </Styled.Figure>
          {this.props.showTitle ? (
            <Styled.Title
              dangerouslySetInnerHTML={{
                __html: this.resource.attributes.titleFormatted
              }}
            />
          ) : null}
        </Styled.Inner>
      </Styled.Wrapper>
    );
  }
}

export default withTranslation()(ResourceThumbnail);
