import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { currentUserActions } from "actions";
import classNames from "classnames";
import { CSSTransitionGroup as ReactCSSTransitionGroup } from "react-transition-group";

export default class ProjectFollow extends Component {
  static displayName = "Project.Follow";

  static propTypes = {
    authenticated: PropTypes.bool,
    favorites: PropTypes.object,
    dispatch: PropTypes.func,
    project: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      view: "follow"
    };
  }

  static getDerivedStateFromProps(nextProps) {
    const followed = get(nextProps.favorites, nextProps.project.id);
    if (followed) return { view: "unfollow" };
    return { view: "follow" };
  }

  componentDidMount() {
    if (this.isFollowed(this.props)) {
      this.setView("unfollow");
    } else {
      this.setView("follow");
    }
  }

  getFollowed(props) {
    return get(props.favorites, props.project.id);
  }

  setView(view) {
    this.setState(Object.assign({}, this.state, { view }));
  }

  handleFollow = event => {
    event.preventDefault();
    event.stopPropagation();
    const { id, type } = this.props.project;
    this.props.dispatch(currentUserActions.follow({ id, type }));
  };

  handleUnfollow = event => {
    event.preventDefault();
    event.stopPropagation();
    this.setView("unfollow-confirm-active");
  };

  handleUnfollowConfirmed = event => {
    event.preventDefault();
    event.stopPropagation();
    const followed = this.getFollowed(this.props);
    if (followed) {
      this.props.dispatch(
        currentUserActions.unfollow(this.props.project.id, followed.id)
      );
    }
  };

  toggleFollow = event => {
    event.preventDefault();
    event.stopPropagation();
    const followed = this.getFollowed(this.props);
    if (followed) {
      this.props.dispatch(
        currentUserActions.unfollow(this.props.project.id, followed.id)
      );
    } else {
      const { id, type } = this.props.project;
      this.props.dispatch(currentUserActions.follow({ id, type }));
    }
  };

  screenReaderButtonText() {
    if (this.state.view === "follow" || this.state.view === "follow-active") {
      return "Unfollow " + this.props.project.attributes.title;
    } else if (
      this.state.view === "unfollow" ||
      this.state.view === "unfollow-active"
    ) {
      return "Follow " + this.props.project.attributes.title;
    }
  }

  activate = () => {
    if (this.state.view === "follow") {
      this.setView("follow-active");
    } else if (this.state.view === "unfollow") {
      this.setView("unfollow-active");
    }
  };

  deactivate = () => {
    if (this.state.view === "follow-active") {
      this.setView("follow");
    } else if (this.state.view === "unfollow-confirm-active") {
      this.setView("unfollow");
    } else if (this.state.view === "unfollow-active") {
      this.setView("unfollow");
    }
  };

  isAuthenticated() {
    return this.props.authenticated === true;
  }

  isFollowed(props) {
    const followed = this.getFollowed(props);
    if (followed) return true;
    return false;
  }

  render() {
    if (!this.isAuthenticated()) return null;

    const wrapperClasses = classNames({
      "follow-button-wrapper": true,
      follow: this.state.view === "follow",
      "follow-active": this.state.view === "follow-active",
      unfollow: this.state.view === "unfollow",
      "unfollow-active": this.state.view === "unfollow-active",
      "unfollow-confirm-active": this.state.view === "unfollow-confirm-active"
    });

    let clickHandler;
    if (this.state.view === "follow") clickHandler = this.handleFollow;
    if (this.state.view === "follow-active") clickHandler = this.handleFollow;
    if (this.state.view === "unfollow") clickHandler = this.handleUnfollow;
    if (this.state.view === "unfollow-active")
      clickHandler = this.handleUnfollow;
    if (this.state.view === "unfollow-confirm-active")
      clickHandler = this.handleUnfollowConfirmed;

    return (
      <div>
        <button className="screen-reader-text" onClick={this.toggleFollow}>
          {this.screenReaderButtonText()}
        </button>
        <div
          onClick={clickHandler}
          onMouseEnter={this.activate}
          onMouseLeave={this.deactivate}
          className={wrapperClasses}
          role="presentation"
          aria-hidden="true"
        >
          <div className="following-button" aria-hidden="true">
            <div className="icons">
              <i key="minus" className="manicon manicon-minus-bold" />
              <i key="check" className="manicon manicon-check-bold" />
              <i key="plus" className="manicon manicon-plus-bold" />
            </div>

            <ReactCSSTransitionGroup
              transitionName="following"
              transitionEnterTimeout={300}
              transitionLeaveTimeout={300}
            >
              {this.state.view === "follow" ||
              this.state.view === "follow-active" ? (
                <span key="follow" className="follow-text">
                  Follow
                </span>
              ) : null}
              {this.state.view === "unfollow" ||
              this.state.view === "unfollow-active" ? (
                <span
                  key="unfollow"
                  className="follow-text follow-text-hide-immediately"
                >
                  Unfollow
                </span>
              ) : null}
              {this.state.view === "unfollow-confirm" ||
              this.state.view === "unfollow-confirm-active" ? (
                <span
                  key="unfollow-confirm"
                  className="follow-text follow-text-show-immediately"
                >
                  Are You Sure?
                </span>
              ) : null}
            </ReactCSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}
