import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import isNil from "lodash/isNil";

export default class ListEntitiesListTextTitle extends PureComponent {
  static displayName = "List.Entities.List.TextTitle";

  static propTypes = {
    titleIcon: PropTypes.string,
    title: PropTypes.node,
    count: PropTypes.number
  };

  static defaultProps = {};

  get count() {
    return this.props.count;
  }

  get hasCount() {
    return !isNil(this.count);
  }

  get title() {
    const { title } = this.props;
    if (this.hasCount) return `${this.count} ${title}`;
    return title;
  }

  get titleIcon() {
    return this.props.titleIcon;
  }

  render() {
    return (
      <h3 className="entity-list__title">
        {this.titleIcon && (
          <figure className="entity-list__title-icon">
            <Utility.IconComposer icon={this.titleIcon} />
          </figure>
        )}
        {this.title}
      </h3>
    );
  }
}
