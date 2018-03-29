import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";

export default class ResourceTagList extends Component {
  static displayName = "Resource.TagList";

  static propTypes = {
    resource: PropTypes.object,
    disabledLinks: PropTypes.bool
  };

  static defaultProps = {
    disabledLinks: false
  };

  mapTagsToLinks(resource) {
    const tags = resource.attributes.tagList;
    const project = resource.relationships.project;
    const out = [];
    tags.map((tag, index) => {
      return out.push(this.createTagLink(tag, project.attributes.slug, index));
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
    if (!tag || !projectSlug) return null;
    const url = lh.link("frontendProjectResources", projectSlug, {
      tag: tag.toLowerCase()
    });
    return (
      <li key={`${tag}-${index}`}>
        <Link
          onClick={this.stopPropagation}
          className={this.props.disabledLinks ? "disabled" : null}
          to={url}
        >
          {tag}
        </Link>
      </li>
    );
  }

  render() {
    if (!this.props.resource) return null;
    if (!this.hasTags(this.props.resource)) return null;
    return (
      <nav
        className="resource-tag-list"
        onMouseOver={this.stopPropagation}
        onClick={this.stopPropagation}
      >
        <ul>{this.mapTagsToLinks(this.props.resource)}</ul>
      </nav>
    );
  }
}
