import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isNil from "lodash/isNil";

export default class ListEntitiesListSectionTitle extends PureComponent {
  static displayName = "List.Entities.List.SectionTitle";

  static propTypes = {
    titleIcon: PropTypes.string,
    title: PropTypes.node,
    count: PropTypes.node
  };

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

  render() {
    return (
      <header className="entity-list__title backend-header section-heading-tertiary">
        <h2>
          <span className="section-heading-tertiary__shim">{this.title}</span>
        </h2>
      </header>
    );
  }
}
