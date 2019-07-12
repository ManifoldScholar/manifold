import React from "react";
import PropTypes from "prop-types";

export default class GroupNavButtons extends React.PureComponent {
  static propTypes = {
    memberListLink: PropTypes.string,
    openEditDrawer: PropTypes.func
  };

  get buttonClassNames() {
    return "group-page-heading__nav-button";
  }

  render() {
    const { memberListLink, openEditDrawer } = this.props;
    return (
      <div className={"group-page-heading__button-container"}>
        <a className={this.buttonClassNames} href={memberListLink}>
          {"See All Members"}
        </a>
        <button
          className={this.buttonClassNames}
          onClick={() => openEditDrawer()}
        >
          {"Edit Group"}
        </button>
      </div>
    );
  }
}
