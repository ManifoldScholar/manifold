import React, { Component } from "react";
import PropTypes from "prop-types";
import { Resource } from "components/frontend";
import filesize from "filesize";
import FormattedDate from "components/global/FormattedDate";

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

    return (
      <section className="resource-meta">
        {this.props.showIcon
          ? <figure className="resource-type">
              <i className={`manicon manicon-resource-${attr.kind}`} />
            </figure>
          : null}
        <ul className={`meta-list-${this.props.layout}`}>
          <li>
            <span className="meta-label">
              {"Type"}
            </span>
            <span className="meta-value">
              {attr.kind.charAt(0).toUpperCase() + attr.kind.slice(1)}
            </span>
          </li>
          {attr.attachmentFileSize
            ? <li>
                <span className="meta-label">
                  {"File Size"}
                </span>
                <span className="meta-value">
                  {" " + filesize(attr.attachmentFileSize, { round: 0 })}
                </span>
              </li>
            : null}
          {attr.attachmentExtension
            ? <li>
                <span className="meta-label">
                  {"File Format"}
                </span>
                <span className="meta-value">
                  {attr.attachmentExtension}
                </span>
              </li>
            : null}
          <li>
            <span className="meta-label">
              {"Created On"}
            </span>
            <span className="meta-value">
              <FormattedDate format="MMMM DD, YYYY" date={attr.createdAt} />
            </span>
          </li>
          {attr.copyrightStatus
            ? <li>
                <span className="meta-label">
                  {"Copyright Status"}
                </span>
                <span className="meta-value">
                  {attr.copyrightStatus}
                </span>
              </li>
            : null}
          {attr.copyrightHolder
            ? <li>
                <span className="meta-label">
                  {"Copyright Holder"}
                </span>
                <span className="meta-value">
                  {attr.copyrightHolder}
                </span>
              </li>
            : null}
          {attr.creditFormatted
            ? <li>
                <span className="meta-label">
                  {"Credit"}
                </span>
                <span
                  className="meta-value"
                  dangerouslySetInnerHTML={{ __html: attr.creditFormatted }}
                />
              </li>
            : null}
        </ul>

        {this.props.showTags
          ? <Resource.TagList resource={this.props.resource} />
          : null}
      </section>
    );
  }
}
