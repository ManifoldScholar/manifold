import React, { Component, PropTypes } from 'react';
import {
    HeaderNotifications,
    ScrollAware,
    SearchMenuBody,
    SearchMenuButton,
    UIPanel,
    UserMenuBody,
    UserMenuButton
} from '../../components/shared';
import { Link } from 'react-router';
import { startsWith } from 'lodash/string';

export default class Header extends Component {

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authenticated: PropTypes.bool,
    notifications: PropTypes.object,
    visibilityToggle: PropTypes.func,
    visibilityHide: PropTypes.func,
    visibilityShow: PropTypes.func,
    panelToggle: PropTypes.func,
    panelHide: PropTypes.func,
    addNotification: PropTypes.func,
    removeNotification: PropTypes.func,
    removeAllNotifications: PropTypes.func,
    startLogout: PropTypes.func
  };

  toggleSearchPanel = () => {
    this.props.panelToggle('search');
  };

  toggleUserPanel = () => {
    this.props.panelToggle('user');
  };

  showLoginOverlay = () => {
    this.props.visibilityShow('loginOverlay');
  };

  render() {
    const path = this.props.location.pathname;
    const active = startsWith(path, '/browse/following') ? 'following' : 'browse';

    return (
      <ScrollAware>
        <header className={'header-browse'}>
          <div className="header-container">
            <Link to={'/browse'} className="logo">
              <figure>
                <i className="manicon manicon-manifold-logo"></i>
                <span className="screen-reader-text">
                  {'Manifold Logo: Click to return to the browse page'}
                </span>
              </figure>
            </Link>
            <nav className="text-nav">
              <ul>
                <li className={active === 'browse' ? 'active' : ''}>
                  <Link to={`/browse/`}>
                    {'Projects'}
                  </Link>
                </li>
                <li className={active === 'following' ? 'active' : ''}>
                  <Link to={`/browse/following/`}>
                    {'Following'}
                  </Link>
                </li>
              </ul>
            </nav>

            <nav className="menu-dropdowns">
              <ul>
                <li>
                  <SearchMenuButton
                    toggleSearchMenu={this.toggleSearchPanel}
                    active={this.props.visibility.uiPanels.search}
                  />
                  <UIPanel
                    id="search"
                    visibility={this.props.visibility.uiPanels}
                    bodyComponent={SearchMenuBody}
                  />
                </li>
                <li>
                  <UserMenuButton
                    authenticated={this.props.authenticated}
                    active={this.props.visibility.uiPanels.user}
                    showLoginOverlay={this.showLoginOverlay}
                    toggleUserMenu={this.toggleUserPanel}
                  />
                  <UIPanel
                    id="user"
                    visibility={this.props.visibility.uiPanels}
                    bodyComponent={UserMenuBody}

                    // Props required by body component
                    startLogout={this.props.startLogout}
                    hideUserMenu={this.toggleUserPanel}
                  />
                </li>
              </ul>
            </nav>
          </div>

          <div className="header-border"></div>

          <HeaderNotifications
            notifications={this.props.notifications}
            addNotification={this.props.addNotification}
            removeNotification={this.props.removeNotification}
            removeAllNotifications={this.props.removeAllNotifications}
          />
        </header>
      </ScrollAware>
    );
  }
}
