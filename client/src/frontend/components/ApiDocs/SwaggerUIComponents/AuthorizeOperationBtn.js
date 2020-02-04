import React from "react";
import IconComposer from "global/components/utility/IconComposer";

export default class AuthorizeOperationBtn extends React.Component {
  onClick = e => {
    e.stopPropagation();
    const { onClick } = this.props;

    if (onClick) {
      onClick();
    }
  };

  render() {
    const { isAuthorized } = this.props;

    return (
      <button
        className={
          isAuthorized
            ? "authorization__btn locked"
            : "authorization__btn unlocked"
        }
        aria-label={
          isAuthorized
            ? "authorization button locked"
            : "authorization button unlocked"
        }
        onClick={this.onClick}
      >
        <IconComposer icon="lock16" size="default" />
      </button>
    );
  }
}
