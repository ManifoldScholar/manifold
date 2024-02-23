import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { DrawerContext } from "helpers/contexts";
import Button from "./Button";
import * as Styled from "./styles";

export default class DrawerEntityHeader extends PureComponent {
  static displayName = "Drawer.EntityHeader";

  static propTypes = {
    title: PropTypes.string,
    hideTitle: PropTypes.bool,
    children: PropTypes.any,
    buttons: PropTypes.array,
    icon: PropTypes.string,
    buttonLayout: PropTypes.oneOf(["stack", "inline", "grid"]),
    small: PropTypes.bool,
    instructionsAreWarning: PropTypes.bool
  };

  static defaultProps = {
    buttons: [],
    buttonlayout: "stack"
  };

  get stackButtons() {
    return this.props.buttonLayout === "stack";
  }

  get inlineButtons() {
    return !this.props.buttonLayout || this.props.buttonLayout === "inline";
  }

  render() {
    return (
      <DrawerContext.Consumer>
        {contextProps => (
          <Styled.Header $small={this.props.small}>
            {this.props.title && (
              <Styled.TitleWrapper
                id={contextProps?.headerId}
                className={classNames({
                  "screen-reader-text": this.props.hideTitle
                })}
              >
                {this.props.icon && (
                  <Styled.Icon icon={this.props.icon} size={44} />
                )}
                <Styled.Title>{this.props.title}</Styled.Title>
              </Styled.TitleWrapper>
            )}
            {this.props.instructions && (
              <Styled.Instructions $warning={this.props.instructionsAreWarning}>
                {this.props.instructions}
              </Styled.Instructions>
            )}
            {this.props.children}
            {this.props.buttons.length > 0 && (
              <Styled.ButtonGroup
                $grid={this.props.buttonLayout === "grid"}
                className={classNames({
                  "utility-button-group": true,
                  "utility-button-group--stack": this.stackButtons,
                  "utility-button-group--inline": this.inlineButtons
                })}
              >
                {this.props.buttons &&
                  this.props.buttons.map(button => (
                    <Button key={button.label} {...button} />
                  ))}
              </Styled.ButtonGroup>
            )}
          </Styled.Header>
        )}
      </DrawerContext.Consumer>
    );
  }
}
