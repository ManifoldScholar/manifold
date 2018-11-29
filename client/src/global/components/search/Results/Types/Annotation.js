import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import Annotation from "reader/components/annotation";

export default class SearchResultsTypeAnnotation extends PureComponent {
  static displayName = "Search.Results.Type.Annotation";

  static propTypes = {
    result: PropTypes.object
  };

  render() {
    const { result } = this.props;
    const annotation = result.relationships.model;
    const parents = result.attributes.parents;
    const url = lh.link(
      "readerSection",
      parents.text.slug,
      parents.textSection.id
    );
    const title = parents.text.title;
    const section = parents.textSection.title;

    return (
      <li className="result-annotation" key={result.id}>
        <Link to={`${url}#annotation-${result.attributes.searchableId}`}>
          <div className="result">
            <Annotation.Meta
              subject={`Annotated "${section}" in ${title}`}
              annotation={annotation}
              creator={annotation.relationships.creator}
              showAnnotationLabel
            />
            <p
              className="snippet with-highlights"
              dangerouslySetInnerHTML={{
                __html: `\u2026 ${result.attributes.highlightedBody}\u2026`
              }}
            />
          </div>
        </Link>
      </li>
    );
  }
}
