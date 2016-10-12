import React, { Component, PropTypes } from 'react';
import get from 'lodash/get';
import { authActions } from 'actions';

export default class ProjectFollow extends Component {

  static displayName = "Project.Follow";

  static propTypes= {
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    project: PropTypes.object
  };

  constructor() {
    super();
    this.handleFollow = this.handleFollow.bind(this);
    this.handleUnfollow = this.handleUnfollow.bind(this);
    this.isFollowed = this.isFollowed.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  getFollowed() {
    return get(this.props.favorites, this.props.project.id);
  }

  handleFollow(event) {
    event.preventDefault();
    event.stopPropagation();
    const { id, type } = this.props.project;
    this.props.dispatch(authActions.follow({ id, type }));
  }

  handleUnfollow(event) {
    event.preventDefault();
    event.stopPropagation();
    const followed = this.getFollowed();
    if (followed) {
      this.props.dispatch(authActions.unfollow(this.props.project.id, followed.id));
    }
  }

  isAuthenticated() {
    return this.props.authenticated === true;
  }

  isFollowed() {
    const followed = this.getFollowed();
    if (followed) return true;
    return false;
  }

  render() {
    if (!this.isAuthenticated()) return null;

    // Set following to true to see "Following/Unfollow" widget
    // NB: This behavior will need to be more complex in the future, such that
    // clicking the follow button will change its state (and trigger an action)
    // but not actually swap the buttons until the user has hovered out of
    // the element.
    let widget = (
      <div onClick={this.handleFollow} className="follow-button">
        <i className="manicon manicon-plus-bold"></i>
        <span className="follow-text">{'Follow'}</span>
      </div>
    );

    if (this.isFollowed()) {
      widget = (
        <div onClick={this.handleUnfollow} className="followed-button">
          <i className="manicon manicon-minus-bold"></i>
          <i className="manicon manicon-check-bold"></i>
          <span className="follow-text">{'Unfollow'}</span>
        </div>
      );
    }

    return widget;
  }

}
