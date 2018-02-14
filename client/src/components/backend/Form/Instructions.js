import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";

export default class Instructions extends PureComponent {
  static propTypes = {
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
  };

  static defaultProps = {
    instructions: null
  };

  renderInstructions() {
    const { instructions } = this.props;
    if (isString(instructions)) {
      return <span className="instructions">{instructions}</span>;
    }
    return instructions;
  }

  render() {
    return this.renderInstructions();
  }
}
