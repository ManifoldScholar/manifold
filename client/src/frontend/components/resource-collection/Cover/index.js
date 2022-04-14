import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Utility from "global/components/utility";
import * as Styled from "./styles";

class ResourceCollectionCover extends Component {
  static displayName = "ResourceCollection.Cover";

  static propTypes = {
    resourceCollection: PropTypes.object.isRequired,
    urlCreator: PropTypes.func.isRequired,
    itemHeadingLevel: PropTypes.oneOf([2, 3, 4, 5, 6]),
    t: PropTypes.func
  };

  static defaultProps = {
    itemHeadingLevel: 4
  };

  get titleTag() {
    return `h${this.props.itemHeadingLevel}`;
  }

  render() {
    const collectionsBackground = "/static/images/resource-collection.jpg";
    const { resourceCollection } = this.props;
    const attr = resourceCollection.attributes;
    const bgImage = attr.thumbnailStyles.medium
      ? attr.thumbnailStyles.medium
      : collectionsBackground;

    return (
      <Styled.Cover
        to={this.props.urlCreator(resourceCollection)}
        style={{ backgroundImage: "url(" + bgImage + ")" }}
      >
        <Styled.TitleOverlay>
          <Styled.Title as={this.titleTag}>{attr.title}</Styled.Title>
          <Styled.IconWrapper>
            <Utility.IconComposer size={48} icon="resourceCollection64" />
            <Styled.IconText>
              {this.props.t("glossary.collection_title_case_one")}
            </Styled.IconText>
          </Styled.IconWrapper>
        </Styled.TitleOverlay>
      </Styled.Cover>
    );
  }
}

export default withTranslation()(ResourceCollectionCover);
