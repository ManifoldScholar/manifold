import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class ResourceVariantList extends Component {
  static displayName = "Resource.VariantList";

  static propTypes = {
    resource: PropTypes.object
  };

  renderVariant(variant) {
    const url = this.props.resource.attributes[`${variant}Url`];
    const filename = this.props.resource.attributes[`${variant}FileName`];
    if (!filename || !url) return null;

    return (
      <Styled.Item key={url}>
        <Styled.Link href={url} target="_blank" rel="noopener noreferrer">
          <Styled.LinkIcon icon="arrowDown16" size="default" />
          <Styled.LinkText>{filename}</Styled.LinkText>
        </Styled.Link>
      </Styled.Item>
    );
  }

  renderVariants() {
    const variants = ["variantFormatOne", "variantFormatTwo", "highRes"];
    return variants
      .map(variant => {
        return this.renderVariant(variant);
      })
      .filter(item => item);
  }

  render() {
    const children = this.renderVariants();
    if (children.length === 0) return null;

    return (
      <Styled.Container>
        <Styled.Title>
          {`${this.props.t("pages.subheaders.variants")}:`}
        </Styled.Title>
        <Styled.List>{children}</Styled.List>
      </Styled.Container>
    );
  }
}

export default withTranslation()(ResourceVariantList);
