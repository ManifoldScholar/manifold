import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListEntitiesListEmpty extends PureComponent {
  static displayName = "List.Entities.List.Empty";

  static propTypes = {
    message: PropTypes.node
  };

  static defaultProps = {
    message: "Sorry, no results were found."
  };

  get message() {
    return this.props.message;
  }

  render() {
    return <div className="entity-list__empty-message">{this.message}</div>;
  }
}
