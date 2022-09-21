import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import * as Styled from "./styles";

export default class Instructions extends PureComponent {
  static propTypes = {
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    id: PropTypes.string,
    withActions: PropTypes.bool,
    styleType: PropTypes.string
  };

  static defaultProps = {
    instructions: null
  };

  renderInstructions() {
    const { instructions, className, withActions, styleType } = this.props;

    const InstructionsComponent =
      styleType === "secondary"
        ? Styled.SecondaryInstructions
        : Styled.PrimaryInstructions;

    if (isString(instructions)) {
      return (
        <InstructionsComponent
          className={className}
          $withActions={withActions}
          id={this.props.id}
        >
          {instructions}
        </InstructionsComponent>
      );
    }
    return instructions;
  }

  render() {
    return this.renderInstructions();
  }
}
