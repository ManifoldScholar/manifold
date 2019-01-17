import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import { Icon } from "global/components/svg";

export default class ResourceListTotals extends Component {
  static displayName = "ResourceList.Totals";

  static propTypes = {
    count: PropTypes.number,
    project: PropTypes.object.isRequired
  };

  render() {
    if (!this.props.count) return null;

    const units = this.props.count > 1 ? "Collections" : "Collection";
    const baseClass = "resource-total";

    return (
      <div className={baseClass}>
        <Link
          className={`${baseClass}__link`}
          to={lh.link(
            "frontendProjectResources",
            this.props.project.attributes.slug // TODO: send to collections page
          )}
        >
          <span className={`${baseClass}__value`}>
            {this.props.count.toLocaleString()}
          </span>
          {` Total ${units}`}
          <Icon.ArrowLong size={30} iconClass={`${baseClass}__icon`} />
        </Link>
      </div>
    );
  }
}
