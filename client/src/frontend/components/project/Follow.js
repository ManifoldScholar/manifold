import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import has from "lodash/has";
import { currentUserActions } from "actions";
import Project from "global/components/project";

import withScreenReaderStatus from "hoc/with-screen-reader-status";

class ProjectFollow extends Component {
  static displayName = "Project.Follow";

  static propTypes = {
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    project: PropTypes.object
  };

  get followMessage() {
    return "You are now following this project";
  }

  get unfollowMessage() {
    return "You are no longer following this project.";
  }

  get selected() {
    return has(this.props.favorites, this.props.project.id);
  }

  handleFollow = () => {
    const { id, type } = this.props.project;
    this.props.dispatch(currentUserActions.follow({ id, type }));
    this.props.setScreenReaderStatus(this.followMessage);
  };

  handleUnfollow = () => {
    const followed = get(this.props.favorites, this.props.project.id);
    this.props.dispatch(
      currentUserActions.unfollow(this.props.project.id, followed.id)
    );
    this.props.setScreenReaderStatus(this.unfollowMessage);
  };

  render() {
    if (!this.props.authenticated) return null;
    return (
      <Project.CoverButton
        addText="Follow"
        removeText="Unfollow"
        selected={this.selected}
        addHandler={this.handleFollow}
        removeHandler={this.handleUnfollow}
        project={this.props.project}
        confirm
      />
    );
  }
}

export default withScreenReaderStatus(ProjectFollow);
