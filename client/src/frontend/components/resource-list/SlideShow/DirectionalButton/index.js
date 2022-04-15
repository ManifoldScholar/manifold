import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

const RIGHT = "right";
const LEFT = "left";

export default class DirectionalButton extends PureComponent {
  static displayName = "ResourceList.Slideshow.DirectionalButton";

  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    direction: PropTypes.oneOf([RIGHT, LEFT]),
    paginationText: PropTypes.string.isRequired,
    screenReaderText: PropTypes.string.isRequired
  };

  static defaultProps = {
    onClick: () => null,
    disabled: false,
    direction: RIGHT
  };

  get isNext() {
    return this.props.direction === RIGHT;
  }

  get isPrevious() {
    return this.props.direction === LEFT;
  }

  get circleArrowIcon() {
    return this.isNext ? "circleArrowRight64" : "circleArrowLeft64";
  }

  get arrowIcon() {
    return this.isNext ? "arrowRight16" : "arrowLeft16";
  }

  render() {
    const { onClick, disabled, paginationText, screenReaderText } = this.props;

    const ButtonComponent = this.isNext ? Styled.Next : Styled.Prev;
    const IconSmComponent = this.isNext ? Styled.NextIconSm : Styled.PrevIconSm;

    return (
      <ButtonComponent onClick={onClick} disabled={disabled}>
        <Styled.IconLg icon={this.circleArrowIcon} size={50} />
        <IconSmComponent icon={this.arrowIcon} size="default" />
        <Styled.Text aria-hidden="true">{paginationText}</Styled.Text>
        <span className="screen-reader-text">{screenReaderText}</span>
      </ButtonComponent>
    );
  }
}
