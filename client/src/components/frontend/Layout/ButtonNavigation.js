import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import throttle from "lodash/throttle";
import lh from "helpers/linkHandler";

export default class LayoutButtonNavigation extends Component {
  static displayName = "Layout.ButtonNavigation";

  static propTypes = {
    grayBg: PropTypes.bool,
    showProjects: PropTypes.bool,
    showFollowing: PropTypes.bool,
    showProjectCollections: PropTypes.bool,
    hideAtNarrow: PropTypes.bool,
    authenticated: PropTypes.bool
  };

  static defaultProps = {
    grayBg: true,
    showProjects: true,
    showFollowing: true,
    showProjectCollections: false,
    authenticated: false
  };

  constructor() {
    super();
    this._projectsButtonEl = null;
    this._followingButtonEl = null;
  }

  componentDidMount() {
    this.throttledWidth = throttle(() => {
      this.matchButtonWidths();
    }, 200);
    window.addEventListener("resize", this.throttledWidth);
  }

  componentDidUpdate() {
    this.matchButtonWidths();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.throttledWidth);
  }

  matchButtonWidths = () => {
    if (!this._projectsButtonEl || !this._followingButtonEl) return;
    // This currently gets the wrong measurement most of the time
    // console.log(this._followingButtonEl.offsetWidth, 'offset width');
    const target = this._followingButtonEl.offsetWidth;
    this._projectsButtonEl.style.width = `${target}px`;
  };

  renderProjectsButton = () => {
    if (!this.props.showProjects && !this.props.showProjectCollections)
      return null;
    let url,
      label = null;

    if (this.props.showProjects) {
      url = lh.link("frontendProjects");
      label = "See All Projects";
    } else if (this.props.showProjectCollections) {
      url = lh.link("frontendProjectCollections");
      label = "See Projects Collections";
    }

    return (
      <Link to={url} className="button-icon-primary">
        <span
          ref={node => {
            this._projectsButtonEl = node;
          }}
        >
          <i className="manicon manicon-books-on-shelf" aria-hidden="true" />
          {label}
        </span>
      </Link>
    );
  };

  renderFollowingButton = () => {
    if (this.props.authenticated !== true) return null;
    if (this.props.showFollowing !== true) return null;
    return (
      <Link to={lh.link("frontendFollowing")} className="button-icon-primary">
        <span
          ref={node => {
            this._followingButtonEl = node;
          }}
        >
          <i
            className="manicon manicon-books-with-glasses"
            aria-hidden="true"
          />
          Projects You're Following
        </span>
      </Link>
    );
  };

  render() {
    const sectionClass = classNames({
      "show-50": this.props.hideAtNarrow === true,
      "bg-neutral05": this.props.grayBg === true
    });

    if (!this.renderProjectsButton() && !this.renderFollowingButton())
      return null;
    return (
      <section className={sectionClass}>
        <div className="container">
          <nav className="button-nav">
            {this.renderProjectsButton()}
            {this.renderFollowingButton()}
          </nav>
        </div>
      </section>
    );
  }
}
