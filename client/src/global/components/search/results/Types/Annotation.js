/* eslint prettier/prettier: 0 */
import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import Utility from "global/components/utility";
import FormattedDate from "global/components/FormattedDate";
import withSearchResultHelper from "./searchResultHelper";
import Generic from "./Generic";

class SearchResultsTypeAnnotation extends PureComponent {
  static displayName = "Search.Results.Type.Annotation";

  static propTypes = {
    result: PropTypes.object,
    highlightedAttribute: PropTypes.func.isRequired
  };

  get result() {
    return this.props.result;
  }

  get model() {
    return this.props.result.relationships.model;
  }

  get text() {
    return this.result.attributes.parents.text;
  }

  get parent() {
    return this.text.title;
  }

  get textSection() {
    return this.result.attributes.parents.text;
  }

  get creatorAttributes() {
    return this.model.relationships.creator.attributes;
  }

  get description() {
    return this.props.highlightedAttribute("fullText");
  }

  get title() {
    const name = this.creatorAttributes.fullName;
    return (
      <React.Fragment>
        {name}
        <span className="search-result__subtitle">annotated</span>
        {" "}
        {this.parent}
      </React.Fragment>
    );
  }

  get url() {
    const base = lh.link("readerSection", this.text.slug, this.textSection.id);
    return `${base}#annotation-${this.result.attributes.searchableId}`;
  }

  render() {
    return (
      <Generic
        url={this.url}
        title={this.title}
        parentUrl={this.parentUrl}
        description={this.description}
        label="Annotation"
        figure={
          <React.Fragment>
            {this.creatorAttributes.avatarStyles.smallSquare ? (
              <img
                className="search-result__avatar"
                alt={`The avatar for ${this.creatorAttributes.fullName}`}
                src={this.creatorAttributes.avatarStyles.smallSquare}
              />
            ) : (
              <div className="search-result__avatar">
                <Utility.IconComposer icon="avatar64" />
              </div>
            )}
          </React.Fragment>
        }
        meta={
          <React.Fragment>
            <FormattedDate
              format="distanceInWords"
              date={this.model.attributes.createdAt}
            />{" "}
            ago
          </React.Fragment>
        }
      />
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeAnnotation);
