import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class EntitiesListRow extends PureComponent {

  static propTypes = {
    labels: PropTypes.array
  };

  get labels() {
    return this.props.labels;
  }

  render() {
    return (
      <span className="entity-row__labels">
        {this.labels.map((label, index) => (
          <span key={index} className="entity-row__label">{label}</span>
        ))}
      </span>
    )
  }
}
