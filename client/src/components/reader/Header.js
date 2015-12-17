import React, { Component, PropTypes } from 'react';
import { UserButton } from '../../components/shared';
import { TocDrawer } from './';
import { Link } from 'react-router';

import classNames from 'classnames';

export default class Header extends Component {

  static propTypes = {
    text: PropTypes.object,
    tocVisible: PropTypes.bool,
    toggleTocDrawer: PropTypes.func,
    hideTocDrawer: PropTypes.func,
    showLoginOverlay: PropTypes.func,
    authenticated: PropTypes.bool
  };

  render = () => {
    const buttonIndexClass = classNames({
      'button-index': true,
      'active': this.props.tocVisible,
    });
    return (
        <header className="header-reader">
          <Link to={`/browse/project/${this.props.text.relationships.project.data.id}`} >
            <button className="button-close" >
              <i className="manicon manicon-x"></i>
                <span className="screen-reader-text">
                  {'Click to close reader'}
                </span>
            </button>
          </Link>
          <button className={buttonIndexClass} onClick={this.props.toggleTocDrawer}>
            {'Contents'}<i className="manicon manicon-caret-down"></i>
          </button>
          <h2 className="title">
            {this.props.text.attributes.title}
          </h2>
          <nav className="widget-nav">
            <UserButton showLoginOverlay={this.props.showLoginOverlay}
                        authenticated={this.props.authenticated} />
          </nav>
          <TocDrawer text={this.props.text} visible={this.props.tocVisible} hideTocDrawer={this.props.hideTocDrawer} />
        </header>
    );
  };
}
