import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class Avatar extends React.PureComponent {
  static propTypes = {
  };

  get avatarClassNames() {
    return classNames({
      "table__avatar-placeholder" : !this.avatar,
      "table__avatar-container": this.avatar,
      "table__hide-desktop": this.viewportVisibility === "hideDesktop"
    });
  }

  get avatarImageClassNames() {
    return "table__avatar-image";
  }

  get avatar() {
    return this.props.avatar;
  }

  get viewportVisibility() {
    return this.props.viewportVisibility;
  }

  render() {
    return (
      <span className={this.avatarClassNames}>
        {this.avatar &&
          <img
            src={this.avatar}
            alt=""
            className={this.avatarImageClassNames}
          />}
        {!this.avatar &&
          <Utility.IconComposer
            icon="avatar24"
            size={36}
          />}
      </span>
    )
  }
}
