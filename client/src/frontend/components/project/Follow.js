import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import has from "lodash/has";
import { currentUserActions } from "actions";
import CollectToggle from "frontend/components/utility/CollectToggle";

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

  get project() {
    return this.props.project;
  }

  get projectTitle() {
    return this.project.attributes.titlePlaintext;
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
      <CollectToggle
        key={this.selected}
        addText="Add"
        removeText="Remove"
        srAddMessage={`Collect ${this.projectTitle}`}
        srRemoveMessage={`Uncollect ${this.projectTitle}`}
        selected={this.selected}
        onAdd={this.handleFollow}
        onRemove={this.handleUnfollow}
      />
    );
  }
}

export default withScreenReaderStatus(ProjectFollow);
