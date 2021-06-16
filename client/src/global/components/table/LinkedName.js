import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class LinkedName extends React.PureComponent {
  static propTypes = {
    to: PropTypes.string,
    name: PropTypes.string.isRequired,
    tag: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  static displayName = "GenericTable.LinkedName";

  get name() {
    return this.props.name;
  }

  get tag() {
    return this.props.tag;
  }

  render() {
    return (
      <span className="table__name">
        {this.props.to && (
          <Link to={this.props.to} className="table__sr-link">
            View Details
          </Link>
        )}
        <span className="table__name-container">{this.name}</span>
        {this.tag && <span className="table__tag">{this.tag}</span>}
      </span>
    );
  }
}
