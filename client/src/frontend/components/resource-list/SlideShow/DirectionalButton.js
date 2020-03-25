import React, { PureComponent } from "react";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import PropTypes from "prop-types";

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
    const {
      onClick,
      disabled,
      direction,
      paginationText,
      screenReaderText
    } = this.props;

    let style = {};
    if (this.isNext) {
      style = { display: "flex", flexDirection: "row-reverse" };
    }

    return (
      <button
        className={classNames("resource-slideshow__button", {
          "resource-slideshow__button--next": this.isNext,
          "resource-slideshow__button--previous": this.isPrevious
        })}
        style={style}
        onClick={onClick}
        disabled={disabled}
      >
        <IconComposer
          icon={this.circleArrowIcon}
          size={50}
          iconClass={classNames(
            "resource-slideshow__pagination-icon",
            `resource-slideshow__pagination-icon--${direction}`,
            "resource-slideshow__pagination-icon--large"
          )}
        />
        <IconComposer
          icon={this.arrowIcon}
          size="default"
          iconClass={classNames(
            "resource-slideshow__pagination-icon",
            `resource-slideshow__pagination-icon--${direction}`,
            "resource-slideshow__pagination-icon--small"
          )}
        />
        <span
          className="resource-slideshow__pagination-text"
          aria-hidden="true"
        >
          {paginationText}
        </span>
        <span className="screen-reader-text">{screenReaderText}</span>
      </button>
    );
  }
}
