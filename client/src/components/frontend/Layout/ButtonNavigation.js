import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import lh from 'helpers/linkHandler';

export default class LayoutButtonNavigation extends Component {

  static displayName = 'Layout.ButtonNavigation';

  static defaultProps = {
    grayBg: true,
    showBrowse: true,
    showFollowing: true,
    authenticated: false
  };

  static propTypes = {
    grayBg: PropTypes.bool,
    showBrowse: PropTypes.bool,
    showFollowing: PropTypes.bool,
    authenticated: PropTypes.bool
  };

  constructor() {
    super();
    this._browseButtonEl = null;
    this._followingButtonEl = null;
    this.renderBrowseButton = this.renderBrowseButton.bind(this);
    this.renderFollowingButton = this.renderFollowingButton.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.matchButtonWidths = this.matchButtonWidths.bind(this);
  }

  componentDidMount() {
    this.matchButtonWidths();
  }

  matchButtonWidths() {
    if (!this._browseButtonEl || !this._followingButtonEl) return;
    // This currently gets the wrong measurement most of the time
    // console.log(this._followingButtonEl.offsetWidth, 'offset width');
    const target = this._followingButtonEl.offsetWidth;
    this._browseButtonEl.style.width = `${target}px`;
  }

  renderBrowseButton() {
    if (this.props.showBrowse !== true) return null;
    return (
      <Link to={lh.link("frontend")} className="button-icon-primary">
        <span ref={(node) => { this._browseButtonEl = node; }}>
          <i className="manicon manicon-books-on-shelf"></i>See more projects
        </span>
      </Link>
    );
  }

  renderFollowingButton() {
    if (this.props.authenticated !== true) return null;
    if (this.props.showFollowing !== true) return null;
    return (
      <Link to={lh.link("frontendFollowing")} className="button-icon-primary">
        <span ref={(node) => { this._followingButtonEl = node; }}>
          <i className="manicon manicon-books-with-glasses"></i>Projects You're Following
        </span>
      </Link>
    );
  }

  render() {
    const sectionClass = classNames({
      'bg-neutral05': this.props.grayBg === true
    });

    if (!this.renderBrowseButton() && !this.renderFollowingButton()) return null;
    return (
      <section className={sectionClass}>
        <div className="container">
          <nav className="button-nav">
            {this.renderBrowseButton()}
            {this.renderFollowingButton()}
          </nav>
        </div>
      </section>
    );
  }

}
