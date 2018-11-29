import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import FormattedDate from "global/components/formatted-date";
import Resourceish from "frontend/components/resourceish";

export default class SearchResultsTypeResource extends PureComponent {
  static displayName = "Search.Results.Type.Resource";

  static propTypes = {
    result: PropTypes.object,
    typeLabel: PropTypes.string
  };

  capitalize(s) {
    return s && s[0].toUpperCase() + s.slice(1);
  }

  resultTitle(result) {
    return result.attributes.highlightedTitle || result.attributes.title;
  }

  resultBody(result) {
    return result.attributes.highlightedBody || result.attributes.body;
  }

  render() {
    const { result } = this.props;
    const resource = result.relationships.model;
    const attr = resource.attributes;
    const parent = result.attributes.parents.project;
    if (!resource) return false;

    const resourceLink = parent
      ? lh.link("frontendProjectResource", parent.slug, attr.slug)
      : "#";

    return (
      <li className="result-resource" key={result.id}>
        <Link className="result" to={resourceLink}>
          <figure className="image">
            <Resourceish.Thumbnail
              resourceish={resource}
              showTitle={false}
              showKind={false}
              additionalClasses="icon-only"
            />
          </figure>
          <div className="body">
            <h3 className="title with-highlights">
              <span
                dangerouslySetInnerHTML={{ __html: this.resultTitle(result) }}
              />
              {parent ? (
                <span className="title-parent">
                  {" in "} {parent.title}
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
                prefix={`${this.capitalize(attr.kind)} added`}
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
