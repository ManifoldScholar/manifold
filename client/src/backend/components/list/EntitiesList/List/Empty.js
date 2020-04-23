import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class ListEntitiesListEmpty extends PureComponent {
  static displayName = "List.Entities.List.Empty";

  static propTypes = {
    message: PropTypes.node,
    listStyle: PropTypes.oneOf(["rows", "tiles", "grid", "bare", "well"])
  };

  static defaultProps = {
    message: "Sorry, no results were found."
  };

  get message() {
    return this.props.message;
  }

  render() {
    const { listStyle } = this.props;

    const wrapperClasses = classNames({
      "entity-list__empty-message": true,
      "entity-list__empty-message--well": listStyle === "well"
    });

    return <div className={wrapperClasses}>{this.message}</div>;
  }
}
