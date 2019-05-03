import React, { Component } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import IconComputed from "global/components/icon-computed";

export default class ResourceTitle extends Component {
  static defaultProps = {
    showIcon: true,
    showDate: true
  };

  static displayName = "Resource.Title";

  static propTypes = {
    resource: PropTypes.object,
    showIcon: PropTypes.bool,
    showDate: PropTypes.bool
  };

  render() {
    const attr = this.props.resource.attributes;

    return (
      <div className="resource-title">
        {this.props.showIcon ? (
          <figure className={`resource-icon ${attr.kind}`}>
            <IconComputed.Resource icon={attr.kind} size={60} />
          </figure>
        ) : null}
        <div>
          <h1 dangerouslySetInnerHTML={{ __html: attr.titleFormatted }} />
          {this.props.showDate ? (
            <span className="resource-date">
              {"Resource added "}
              <FormattedDate format="MMMM, YYYY" date={attr.createdAt} />
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}
