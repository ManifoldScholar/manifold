import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import Generic from "./Generic";
import withSearchResultHelper from "./searchResultHelper";
import EntityThumbnail from "global/components/entity-thumbnail";

class SearchResultsTypeTextSection extends PureComponent {
  static displayName = "Search.Results.Type.TextSection";

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
    const { title } = this.text;
    return title;
  }

  get title() {
    return this.props.highlightedAttribute("title");
  }

  get description() {
    return this.props.highlightedAttribute("fullText");
  }

  get textNodes() {
    const {
      attributes: { textNodes }
    } = this.result;
    return textNodes;
  }

  get hasExcerpts() {
    const textNodes = this.textNodes;
    return textNodes && textNodes.total > 0;
  }

  get excerpts() {
    const text = this.text;
    const model = this.model;
    if (!this.hasExcerpts) return [];
    const { hits } = this.textNodes;
    return hits.map(h => ({
      ...h,
      url: lh.link("readerSection", text.slug, model.id, `#node-${h.nodeUuid}`)
    }));
  }

  render() {
    return (
      <Generic
        title={this.title}
        parent={this.parent}
        parentUrl={lh.link("reader", this.text.slug)}
        url={lh.link("readerSection", this.text.slug, this.model.id)}
        label="full text"
        collectable={this.result}
        figure={
          <EntityThumbnail.TextSection
            entity={this.model}
            width="100%"
            height={null}
            className="search-result--figure-narrow-svg"
          />
        }
        excerpts={this.excerpts}
      />
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeTextSection);
