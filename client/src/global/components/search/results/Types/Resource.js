import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import EntityThumbnail from "global/components/entity-thumbnail";
import Generic from "./Generic";
import withSearchResultHelper from "./searchResultHelper";

class SearchResultsTypeResource extends PureComponent {
  static displayName = "Search.Results.Type.Resource";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
    highlightedAttribute: PropTypes.func.isRequired
  };

  get kind() {
    const { attributes } = this.model;
    return attributes.kind;
  }

  get result() {
    return this.props.result;
  }

  get model() {
    return this.props.result.relationships.model;
  }

  get project() {
    return this.result.attributes.parents.project;
  }

  get title() {
    return this.props.highlightedAttribute("title");
  }

  get description() {
    return this.props.highlightedAttribute("fullText");
  }

  get url() {
    const { attributes } = this.model;
    return lh.link(
      "frontendProjectResource",
      this.project.slug,
      attributes.slug
    );
  }

  get createdAt() {
    const { attributes } = this.model;
    return attributes.createdAt;
  }

  get parent() {
    const { title } = this.project;
    return title;
  }

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  render() {
    return (
      <Generic
        url={this.url}
        title={this.title}
        parent={this.parent}
        hideParent={this.props.hideParent}
        attribution={this.creatorsString}
        description={this.description}
        label="resource"
        figure={
          <EntityThumbnail.Resource
            entity={this.model}
            width="100%"
            height={null}
          />
        }
        meta={
          <FormattedDate
            prefix={`${this.capitalize(this.kind)} added`}
            format="MMMM, yyyy"
            date={this.createdAt}
          />
        }
      />
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeResource);
