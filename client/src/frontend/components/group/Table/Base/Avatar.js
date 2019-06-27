import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";

export default class Avatar extends React.PureComponent {
  static propTypes = {
  };

  get avatarClassNames() {
    return classNames({
      "group-table__avatar-placeholder" : !this.avatar,
      "group-table__avatar-container": this.avatar
    });
  }

  get avatarImageClassNames() {
    return "group-table__avatar-image";
  }

  get avatar() {
    return this.props.avatar;
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
