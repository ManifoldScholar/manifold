import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Instructions from "./Instructions";

export default class Divider extends PureComponent {
  static propTypes = {
    label: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static defaultProps = {
    instructions: null
  };

  render() {
    const { instructions, label } = this.props;

    return (
      <div>
        <span>{label}</span>
        {instructions && <Instructions instructions={instructions} />}
      </div>
    );
  }
}
