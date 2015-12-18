import React, { Component, PropTypes } from 'react';
import { UserMenu } from '../../components/shared';
import { TocDrawer } from './';
import { Link } from 'react-router';

import classNames from 'classnames';

export default class Header extends Component {

  static propTypes = {
    text: PropTypes.object,
    visibility: PropTypes.object,
    visibilityToggle: PropTypes.func,
    visibilityHide: PropTypes.func,
    visibilityShow: PropTypes.func,
    startLogout: PropTypes.func,
    authenticated: PropTypes.bool
  };

  render = () => {
    const buttonIndexClass = classNames({
      'button-index': true,
      'active': this.props.visibility.tocDrawer,
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
            <UserMenu
                toggleUserMenu={() => {this.props.visibilityToggle('userMenu');}}
                hideUserMenu={()=> {this.props.visibilityHide('userMenu');}}
                showLoginOverlay={() => {this.props.visibilityShow('loginOverlay');}}
                startLogout={this.props.startLogout}
                authenticated={this.props.authenticated}
                visible={this.props.visibility.userMenu}
            />
          </nav>
          <TocDrawer text={this.props.text} visible={this.props.visibility.tocDrawer} hideTocDrawer={() => {this.props.visibilityHide('tocDrawer');}} />
        </header>
    );
  };
}
