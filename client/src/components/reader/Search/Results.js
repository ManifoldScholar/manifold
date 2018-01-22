import React, { PureComponent } from "react";
import NoResults from "./NoResults";
import Meta from "../Annotation/Meta";
import PropTypes from "prop-types";
import { Utility } from "components/global";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";

export default class SearchResults extends PureComponent {
  static displayName = "Search.Results";

  static propTypes = {
    results: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func.isRequired
  };

  renderAnnotationResult(result) {
    const { annotation, textSection } = result.relationships;
    const { creator } = annotation.relationships;
    const url = lh.link(
      "readerSection",
      textSection.attributes.textSlug,
      textSection.id
    );
    const title = textSection.attributes.textTitle;
    const section = textSection.attributes.name;
    return (
      <li className="result-annotation" key={result.id}>
        <Link to={`${url}#annotation-${result.attributes.searchableId}`}>
          <div className="result">
            <Meta
              subject={`Annotated "${section}" in ${title}`}
              annotation={annotation}
              creator={creator}
              showAnnotationLabel
            />
            <p
              className="with-highlights"
              dangerouslySetInnerHTML={{
                __html: `\u2026 ${result.attributes.highlightedBody}\u2026`
              }}
            />
          </div>
        </Link>
      </li>
    );
  }

  renderNodeResult(result) {
    const { textSection } = result.relationships;
    const url = lh.link(
      "readerSection",
      textSection.attributes.textSlug,
      textSection.id
    );
    return (
      <li className="result-text" key={result.id}>
        <Link to={`${url}#node-${result.attributes.nodeUuid}`}>
          <div className="result">
            <h5>
              {textSection.attributes.textTitle}: {textSection.attributes.name}
            </h5>
            <p
              className="with-highlights"
              dangerouslySetInnerHTML={{
                __html: `\u2026 ${result.attributes.highlightedBody}\u2026`
              }}
            />
          </div>
        </Link>
      </li>
    );
  }

  render() {
    if (this.props.results && this.props.results.length === 0)
      return <NoResults />;

    return (
      <div className="search-results">
        <label className="label-count">
          <Utility.EntityCount
            pagination={this.props.pagination}
            singularUnit={"result"}
            pluralUnit={"results"}
          />
        </label>
        <ul className="results">
          {this.props.results.map(result => {
            const { searchableType } = result.attributes;
            if (searchableType === "annotation")
              return this.renderAnnotationResult(result);
            if (searchableType === "searchableNode")
              return this.renderNodeResult(result);
            return null;
          })}
        </ul>
        <Utility.Pagination
          pagination={this.props.pagination}
          padding={3}
          paginationClickHandler={this.props.paginationClickHandler}
        />
      </div>
    );
  }
}
