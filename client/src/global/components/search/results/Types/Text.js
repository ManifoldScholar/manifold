import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import EntityThumbnail from "global/components/entity-thumbnail";
import Generic from "./Generic";
import withSearchResultHelper from "./searchResultHelper";

class SearchResultsTypeText extends PureComponent {
  static displayName = "Search.Results.Type.Text";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string,
    highlightedAttribute: PropTypes.func.isRequired
  };

  get title() {
    return this.props.highlightedAttribute("title");
  }

  get description() {
    return this.props.highlightedAttribute("fullText");
  }

  get model() {
    return this.props.result.relationships.model;
  }

  get project() {
    return this.result.attributes.parents.project;
  }

  get result() {
    return this.props.result;
  }

  get url() {
    const { attributes } = this.model;
    return lh.link("reader", attributes.slug);
  }

  get parentUrl() {
    const { slug } = this.project;
    return lh.link("frontendProjectDetail", slug);
  }

  get createdAt() {
    const { attributes } = this.model;
    return attributes.createdAt;
  }

  get parent() {
    const { title } = this.project;
    return title;
  }

  render() {
    return (
      <Generic
        url={this.url}
        title={this.title}
        parent={this.parent}
        parentUrl={this.parentUrl}
        description={this.description}
        label="text"
        collectable={this.result}
        figure={
          <EntityThumbnail.Text
            entity={this.model}
            width="100%"
            height={null}
            className="search-result--figure-narrow-svg"
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

export default withSearchResultHelper(SearchResultsTypeText);
