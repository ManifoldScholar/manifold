import React from "react";
import PropTypes from "prop-types";

export default class Passthrough extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any
  };

  render() {
    return <>{this.props.children}</>;
  }
}
