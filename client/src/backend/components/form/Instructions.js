import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import classnames from "classnames";

export default class Instructions extends PureComponent {
  static defaultProps = {
    instructions: null
  };

  static propTypes = {
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string
  };

  renderInstructions() {
    const { instructions } = this.props;
    const classes = classnames("instructions", this.props.className);

    if (isString(instructions)) {
      return <span className={classes}>{instructions}</span>;
    }
    return instructions;
  }

  render() {
    return this.renderInstructions();
  }
}
