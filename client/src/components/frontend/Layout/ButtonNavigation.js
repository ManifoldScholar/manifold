import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class LayoutButtonNavigation extends Component {

  static displayName = 'Layout.ButtonNavigation';

  static defaultProps = {
    grayBg: true,
    showBrowse: true,
    showFollowing: true
  }

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
    this.matchButtonWidths()
  }

  matchButtonWidths() {
    if(!this._browseButtonEl || !this._followingButtonEl) return;
    const target = this._followingButtonEl.offsetWidth;
    this._browseButtonEl.style.width = `${target}px`;
  }

  renderBrowseButton() {
    if (this.props.showBrowse !== true) return null
    return (
      <Link to={'/browse'}>
        <button ref={(node) => this._browseButtonEl = node} className="button-icon-primary">
          <i className="manicon manicon-books-on-shelf"></i>See more projects
        </button>
      </Link>
    );
  }

  renderFollowingButton() {
    if (this.props.showFollowing !== true) return null
    return (
      <Link to={'/browse/following'}>
        <button ref={(node) => this._followingButtonEl = node} className="button-icon-primary">
          <i className="manicon manicon-books-with-glasses"></i>Projects You're Following
        </button>
      </Link>
    );
  }

  render() {
    const sectionClass = classNames({
      'bg-neutral05': this.props.grayBg == true
    });

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
