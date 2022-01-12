import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class Label extends PureComponent {
  static propTypes = {
    label: PropTypes.string.isRequired
  };

  render() {
    return (
      <div className="section-category-label">
        <div className="container flush">
          <div className="section-category-label__label">
            {this.props.label}
          </div>
        </div>
      </div>
    );
  }
}
