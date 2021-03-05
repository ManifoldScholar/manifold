import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Generic from "./Generic";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import EntityThumbnail from "global/components/entity-thumbnail";
import withSearchResultHelper from "./searchResultHelper";

class SearchResultsTypeProject extends PureComponent {
  static displayName = "Search.Results.Type.Project";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
    highlightedAttribute: PropTypes.func.isRequired
  };

  get hasCreators() {
    if (!this.model) return false;
    return this.model.relationships.creators.length > 0;
  }

  get creators() {
    if (!this.hasCreators) return [];
    const { creators } = this.model.relationships;
    return creators || [];
  }

  get result() {
    return this.props.result;
  }

  get collectable() {
    const { searchableType, searchableId } = this.result.attributes;

    return {
      type: searchableType,
      id: searchableId
    };
  }

  get model() {
    return this.props.result.relationships.model;
  }

  get creatorsString() {
    return this.creators.map(c => c.attributes.fullName).join(", ");
  }

  get title() {
    return this.props.highlightedAttribute("title");
  }

  get description() {
    return this.props.highlightedAttribute("fullText");
  }

  get createdAt() {
    const { attributes } = this.model;
    return attributes.createdAt;
  }

  get url() {
    const { attributes } = this.model;
    return lh.link("frontendProjectDetail", attributes.slug);
  }

  render() {
    return (
      <Generic
        url={this.url}
        title={this.title}
        attribution={this.creatorsString}
        description={this.description}
        label="project"
        collectable={this.collectable}
        figure={
          <EntityThumbnail.Project
            placeholderAttributes={{ mode: "small" }}
            entity={this.model}
            width="100%"
            height={null}
          />
        }
        meta={
          <FormattedDate
            prefix="Published"
            format="MMMM, yyyy"
            date={this.createdAt}
          />
        }
      />
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeProject);
