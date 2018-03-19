import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { Link } from "react-router-dom";

import lh from "helpers/linkHandler";
import { FormattedDate } from "components/global";
import { Project } from "components/frontend";

export default class SearchResultsTypeProject extends PureComponent {
  static displayName = "Search.Results.Type.Project";

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
    const project = get(result, "relationships.model");
    if (!project) return false;
    const attr = project.attributes;
    return (
      <li className="result-project" key={result.id}>
        <Link className="result" to={lh.link("frontendProject", attr.slug)}>
          <figure className="image">
            <Project.Cover project={project} />
          </figure>
          <div className="body">
            <h3
              className="with-highlights title"
              dangerouslySetInnerHTML={{ __html: this.resultTitle(result) }}
            />
            {project.relationships.creators.length > 0 ? (
              <ul className="makers">
                {project.relationships.creators.map(creator => {
                  return (
                    <li key={creator.id}>{creator.attributes.fullName}</li>
                  );
                })}
              </ul>
            ) : null}
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
