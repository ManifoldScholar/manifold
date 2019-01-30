import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import { Icon } from "global/components/svg";
import classNames from "classnames";

export default class ResourceCollectionTotals extends Component {
  static displayName = "ResourceCollection.Totals";

  static propTypes = {
    count: PropTypes.number,
    project: PropTypes.object.isRequired,
    alignLeft: PropTypes.bool,
    tight: PropTypes.bool
  };

  get count() {
    if (!this.props.count) return 0;
    return this.props.count;
  }

  get unit() {
    return this.count > 1 || this.count === 0 ? "Collections" : "Collection";
  }

  render() {
    const baseClass = "resource-total";
    const wrapperClasses = classNames(baseClass, {
      [`${baseClass}--left-aligned`]: this.props.alignLeft,
      [`${baseClass}--tight`]: this.props.tight
    });

    return (
      <div className={wrapperClasses}>
        <Link
          className={`${baseClass}__link`}
          to={lh.link(
            "frontendProjectResourceCollections",
            this.props.project.attributes.slug
          )}
        >
          <span data-id="count" className={`${baseClass}__value`}>
            {this.count.toLocaleString()}
          </span>
          {` Total ${this.unit}`}
          <Icon.ArrowLong size={30} iconClass={`${baseClass}__icon`} />
        </Link>
      </div>
    );
  }
}
