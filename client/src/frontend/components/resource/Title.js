import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import FormattedDate from "global/components/FormattedDate";
import IconComputed from "global/components/icon-computed";
import Collecting from "frontend/components/collecting";

class ResourceTitle extends Component {
  static displayName = "Resource.Title";

  static propTypes = {
    resource: PropTypes.object,
    showIcon: PropTypes.bool,
    showDate: PropTypes.bool,
    t: PropTypes.func
  };

  static defaultProps = {
    showIcon: true,
    showDate: true
  };

  render() {
    const attr = this.props.resource.attributes;

    return (
      <div className="resource-title">
        {this.props.showIcon ? (
          <figure className={`resource-title__icon ${attr.kind}`}>
            <IconComputed.Resource icon={attr.kind} size={60} />
          </figure>
        ) : null}
        <div>
          <div className="resource-title__title-and-toggle">
            <h1
              className="resource-title__title"
              dangerouslySetInnerHTML={{ __html: attr.titleFormatted }}
            />
            <span className="resource-title__collecting-toggle">
              <Collecting.Toggle collectable={this.props.resource} />
            </span>
          </div>
          {this.props.showDate ? (
            <span className="resource-date">
              {this.props.t("dates.resource_added")}{" "}
              <FormattedDate format="MMMM, yyyy" date={attr.createdAt} />
            </span>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withTranslation()(ResourceTitle);
