import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import isNil from "lodash/isNil";

export default class ListEntitiesListBarTitle extends PureComponent {
  static displayName = "List.Entities.List.BarTitle";

  static propTypes = {
    title: PropTypes.node,
    titleIcon: PropTypes.string,
    titleLink: PropTypes.string,
    count: PropTypes.node
  };

  get title() {
    return this.props.title;
  }

  get titleIcon() {
    return this.props.titleIcon;
  }

  get count() {
    return this.props.count;
  }

  get hasCount() {
    return !isNil(this.count);
  }

  render() {
    return (
      <header className="entity-list__title backend-header section-heading-secondary">
        <h1>
          {this.titleIcon && <Utility.IconComposer icon={this.titleIcon} />}
          {this.hasCount && <em>{this.count}</em>} {this.title}
        </h1>
      </header>
    );
  }
}
