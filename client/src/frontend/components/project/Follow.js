import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { currentUserActions } from "actions";
import { Project } from "components/global";

export default class ProjectFollow extends Component {
  static displayName = "Project.Follow";

  static propTypes = {
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    project: PropTypes.object
  };

  getFollowed(props) {
    return get(props.favorites, props.project.id);
  }

  handleFollow = () => {
    const { id, type } = this.props.project;
    this.props.dispatch(currentUserActions.follow({ id, type }));
  };

  handleUnfollow = followed => {
    this.props.dispatch(
      currentUserActions.unfollow(this.props.project.id, followed.id)
    );
  };

  render() {
    if (!this.props.authenticated) return null;

    return (
      <Project.CoverButton
        addText="Follow"
        removeText="Unfollow"
        selected={this.getFollowed(this.props)}
        addHandler={this.handleFollow}
        removeHandler={this.handleUnfollow}
        project={this.props.project}
        confirm
      />
    );
  }
}
