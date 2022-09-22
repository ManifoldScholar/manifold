import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import isString from "lodash/isString";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default class Instructions extends PureComponent {
  static propTypes = {
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    className: PropTypes.string,
    id: PropTypes.string,
    withActions: PropTypes.bool
  };

  static defaultProps = {
    instructions: null
  };

  static contextType = FormContext;

  renderInstructions() {
    const { instructions, className, withActions } = this.props;

    const InstructionsComponent =
      this.context?.styleType === "secondary"
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
