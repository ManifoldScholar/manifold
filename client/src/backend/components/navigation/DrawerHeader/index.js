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
    buttonLayout: PropTypes.oneOf(["stack", "inline"]),
    className: PropTypes.string,
    narrow: PropTypes.bool
  };

  static defaultProps = {
    buttons: [],
    buttonlayout: "stack"
  };

  get stackButtons() {
    return this.props.buttonLayout === "stack";
  }

  get inlineButtons() {
    return this.props.buttonLayout !== "stack";
  }

  render() {
    return (
      <DrawerContext.Consumer>
        {contextProps => (
          <Styled.Header $padSmall={this.props.narrow}>
            {this.props.title && (
              <Styled.Title
                id={contextProps?.headerId}
                className={
                  this.props.hideTitle ? "screen-reader-text" : undefined
                }
              >
                {this.props.icon && (
                  <Styled.TitleIcon icon={this.props.icon} size={44} />
                )}
                <Styled.TitleText>{this.props.title}</Styled.TitleText>
              </Styled.Title>
            )}
            {this.props.children}
            {this.props.buttons.length > 0 && (
              <Styled.UtilityButtons
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
              </Styled.UtilityButtons>
            )}
          </Styled.Header>
        )}
      </DrawerContext.Consumer>
    );
  }
}
