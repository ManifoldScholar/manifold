import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import * as Styled from "./styles";

class ResourceTagList extends Component {
  static displayName = "Resource.TagList";

  static propTypes = {
    resource: PropTypes.object,
    disabledLinks: PropTypes.bool,
    t: PropTypes.func,
    isCard: PropTypes.bool
  };

  static defaultProps = {
    disabledLinks: false
  };

  mapTagsToLinks(resource) {
    const tags = resource.attributes.tagList;
    const project = resource.relationships.project;
    const out = [];
    tags.map((tag, index) => {
      return out.push(this.createTagLink(tag, project?.attributes.slug, index));
    });
    return out;
  }

  hasTags(resource) {
    return (
      resource.attributes.tagList && resource.attributes.tagList.length > 0
    );
  }

  stopPropagation = event => {
    event.stopPropagation();
  };

  createTagLink(tag, projectSlug, index) {
    const { disabledLinks } = this.props;
    if (!projectSlug && !disabledLinks) return null;
    const url = lh.link("frontendProjectResources", projectSlug, {
      tag: tag.toLowerCase()
    });
    const tagProps = disabledLinks
      ? { className: "disabled" }
      : { onClick: this.stopPropagation, to: url, as: Link };
    return (
      <Styled.Tag key={`${tag}-${index}`}>
        <Styled.Label {...tagProps}>{tag}</Styled.Label>
      </Styled.Tag>
    );
  }

  render() {
    if (!this.props.resource) return null;
    if (!this.hasTags(this.props.resource)) return null;
    return (
      <Styled.Container
        onMouseOver={this.stopPropagation}
        onClick={this.stopPropagation}
        role="presentation"
        $isCard={this.props.isCard}
      >
        <span className="screen-reader-text">
          {this.props.t("pages.subheaders.tags_list")}
        </span>
        <Styled.GroupLabel>{this.props.t("metadata.tags")}</Styled.GroupLabel>
        <Styled.List>{this.mapTagsToLinks(this.props.resource)}</Styled.List>
      </Styled.Container>
    );
  }
}

export default withTranslation()(ResourceTagList);
