import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Dropdown extends Component {
  static propTypes = {
    triggerComponent: PropTypes.func,
    bodyComponent: PropTypes.func
  };

  componentDidMount() {
    // Add logic here to show/hide menu
  }

  clickHandler() {}

  render() {
    return (
      <div>
        {/* Second argument as props */}
        {React.createElement(this.props.triggerComponent, {
          onClick: this.clickHandler
        })}
        {React.createElement(this.props.bodyComponent, { ...this.props })}
      </div>
    );
  }
}
