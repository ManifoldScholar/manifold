import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Link } from "react-router-dom";

import lh from "helpers/linkHandler";
import FormattedDate from "global/components/FormattedDate";
import Text from "frontend/components/text";

export default class SearchResultsTypeText extends PureComponent {
  static displayName = "Search.Results.Type.Text";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string
  };

  resultTitle(result) {
    return result.attributes.highlightedTitle || result.attributes.title;
  }

  resultBody(result) {
    return result.attributes.highlightedBody || result.attributes.body;
  }

  render() {
    const { result } = this.props;
    const text = get(result, "relationships.model");
    if (!text) return false;
    const attr = text.attributes;
    const project = result.attributes.parents.project;

    return (
      <li className="result-text" key={result.id}>
        <Link className="result" to={lh.link("reader", attr.slug)}>
          <figure className="image">
            <Text.Cover text={text} />
          </figure>
          <div className="body">
            <h3 className="with-highlights title">
              <span
                dangerouslySetInnerHTML={{ __html: this.resultTitle(result) }}
              />
              {project ? (
                <span className="title-parent">
                  {" in "} {project.title}
                </span>
              ) : null}
            </h3>
            {this.resultBody(result) ? (
              <p
                className="excerpt with-highlights"
                dangerouslySetInnerHTML={{ __html: this.resultBody(result) }}
              />
            ) : null}
            <div className="date">
              <FormattedDate
                prefix="Published"
                format="MMMM, YYYY"
                date={attr.createdAt}
              />
            </div>
          </div>
          <div className="marker tertiary">{this.props.typeLabel}</div>
        </Link>
      </li>
    );
  }
}
