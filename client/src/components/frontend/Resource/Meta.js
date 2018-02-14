import React, { Component } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/frontend";
import filesize from "filesize";
import pickBy from "lodash/pickBy";
import isNull from "lodash/isNull";
import FormattedDate from "components/global/FormattedDate";
import humps from "humps";

export default class ResourceMeta extends Component {
  static displayName = "Resource.Meta";

  static propTypes = {
    resource: PropTypes.object,
    layout: PropTypes.string,
    showIcon: PropTypes.bool,
    showTags: PropTypes.bool
  };

  static defaultProps = {
    showIcon: true,
    showTags: true
  };

  render() {
    const attr = this.props.resource.attributes;
    const exclude = ["altText"];
    const filteredMetadata = pickBy(
      attr.metadataFormatted,
      (v, k) => !exclude.includes(k) && !isNull(v) && v.length > 0
    );
    const keys = Object.keys(filteredMetadata).sort();

    return (
      <section className="resource-meta">
        {this.props.showIcon ? (
          <figure className="resource-type">
            <i className={`manicon manicon-resource-${attr.kind}`} />
          </figure>
        ) : null}
        <ul className={`meta-list-${this.props.layout}`}>
          <li>
            <span className="meta-label">{"Type"}</span>
            <span className="meta-value">
              {attr.kind.charAt(0).toUpperCase() + attr.kind.slice(1)}
            </span>
          </li>
          {attr.attachmentFileSize ? (
            <li>
              <span className="meta-label">{"File Size"}</span>
              <span className="meta-value">
                {" " + filesize(attr.attachmentFileSize, { round: 0 })}
              </span>
            </li>
          ) : null}
          {attr.attachmentExtension ? (
            <li>
              <span className="meta-label">{"File Format"}</span>
              <span className="meta-value">{attr.attachmentExtension}</span>
            </li>
          ) : null}
          <li>
            <span className="meta-label">{"Created On"}</span>
            <span className="meta-value">
              <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
            </span>
          </li>
          {keys.sort().map(key => {
            return (
              <li key={key}>
                <span className="meta-label">
                  {humps.decamelize(key, { separator: " " })}
                </span>
                <span
                  className="meta-value"
                  dangerouslySetInnerHTML={{
                    __html: attr.metadataFormatted[key]
                  }}
                />
              </li>
            );
          })}
        </ul>
        {this.props.showTags ? (
          <Resource.TagList resource={this.props.resource} />
        ) : null}
      </section>
    );
  }
}
