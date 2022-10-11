import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import has from "lodash/has";
import Icon from "./Icon";
import * as Styled from "./styles";

class ResourceishThumbnail extends Component {
  static displayName = "Resourceish.Thumbnail";

  static hasImage(resourceish, variant) {
    return this.imageKey(resourceish, variant) !== undefined;
  }

  static imageKey(resourceish, variant) {
    if (!resourceish) return false;
    const { attributes } = resourceish;
    const lookups = [
      "variantThumbnailStyles",
      "variantPosterStyles",
      "attachmentStyles"
    ];
    return lookups.find(lookup => {
      return has(attributes, `${lookup}.${variant}`);
    });
  }

  static propTypes = {
    resourceish: PropTypes.object,
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

  get resourceish() {
    return this.props.resourceish;
  }

  get resourceishType() {
    return this.resourceish.type;
  }

  get resourceishKind() {
    const kind = this.resourceish.attributes.kind;
    return this.props.t(`resources.kinds.${kind}`);
  }

  get variant() {
    return this.props.variant;
  }

  get noCrop() {
    return this.props.noCrop;
  }

  get image() {
    const key = this.constructor.imageKey(this.resourceish, this.variant);
    if (!key) return null;
    return this.resourceish.attributes[key][this.variant];
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
    switch (this.resourceishType) {
      case "resources":
        if (!this.resourceishKind) break;
        out = this.resourceishKind;
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
    if (!this.resourceish) return null;

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
                <Styled.Image
                  src={this.image}
                  alt={this.resourceish.attributes.altText}
                />
                <Styled.ImageOverlay />
              </Styled.ImageWrapper>
            ) : (
              <Icon resourceish={this.resourceish} />
            )}
          </Styled.Figure>
          {this.props.showTitle ? (
            <Styled.Title
              dangerouslySetInnerHTML={{
                __html: this.resourceish.attributes.titleFormatted
              }}
            />
          ) : null}
        </Styled.Inner>
      </Styled.Wrapper>
    );
  }
}

export default withTranslation()(ResourceishThumbnail);
