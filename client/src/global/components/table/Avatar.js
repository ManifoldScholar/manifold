import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Avatar from "global/components/avatar/index";

export default class TableAvatar extends React.PureComponent {
  static displayName = "GenericTable.Avatar";

  static propTypes = {
    avatar: PropTypes.string,
    viewportVisibility: PropTypes.string
  };

  get avatarClassNames() {
    return classNames({
      "table__avatar-base-container": true,
      "table__hide-desktop": this.viewportVisibility === "hideDesktop",
      "table__avatar-placeholder-container": !this.avatar,
      "table__avatar-image-container": this.avatar
    });
  }

  get avatar() {
    return this.props.avatar;
  }

  get viewportVisibility() {
    return this.props.viewportVisibility;
  }

  render() {
    return (
      <div className={this.avatarClassNames}>
        <Avatar url={this.avatar} />
      </div>
    );
  }
}
