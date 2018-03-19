import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";

export default class SearchResultsTypeAnnotation extends PureComponent {
  static displayName = "Search.Results.Type.SearchableNode";

  static propTypes = {
    result: PropTypes.object,
    context: PropTypes.string,
    typeLabel: PropTypes.string
  };

  resultBody(result) {
    return result.attributes.highlightedBody || result.attributes.body;
  }

  render() {
    const { result } = this.props;
    const searchableNode = result.relationships.model;
    const { project, text, textSection } = result.attributes.parents;
    const url = lh.link("readerSection", text.slug, textSection.id);

    return (
      <li className="result-text-node" key={result.id}>
        <Link
          to={`${url}#node-${searchableNode.attributes.nodeUuid}`}
          className="result"
        >
          <div className="body">
            <header>
              <h3 className="title">
                <span>
                  {textSection.title
                    ? `"${textSection.title}"`
                    : "Untitled Chapter"}
                </span>
                {project ? (
                  <span className="title-parent">
                    {" in "} {text.title}
                  </span>
                ) : null}
              </h3>
            </header>
            {this.resultBody(result) ? (
              <p
                className="with-highlights"
                dangerouslySetInnerHTML={{
                  __html: `\u2026 ${this.resultBody(result)}\u2026`
                }}
              />
            ) : null}
          </div>
          <div className="marker tertiary">{this.props.typeLabel}</div>
        </Link>
      </li>
    );
  }
}
