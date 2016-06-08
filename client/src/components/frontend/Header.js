import React, { Component, PropTypes } from 'react';
import {
    HeaderNotifications,
    HigherOrder,
    SearchMenuBody,
    SearchMenuButton,
    UIPanel,
    UserMenuBody,
    UserMenuButton
} from '../../components/shared';
import { Link } from 'react-router';
import startsWith from 'lodash/startsWith';

export default class Header extends Component {

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
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

  constructor() {
    super();
    this.toggleSearchPanel = this.toggleSearchPanel.bind(this);
    this.toggleUserPanel = this.toggleUserPanel.bind(this);
    this.showSignInUpOverlay = this.showSignInUpOverlay.bind(this);
  }

  toggleSearchPanel() {
    this.props.panelToggle('search');
  }

  toggleUserPanel() {
    this.props.panelToggle('user');
  }

  showSignInUpOverlay() {
    this.props.visibilityShow('signInUpOverlay');
  }

  render() {
    const path = this.props.location.pathname;
    const active = startsWith(path, '/browse/following') ? 'following' : 'browse';
    return (
      <HigherOrder.ScrollAware>
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
                { this.props.authentication.authenticated ?
                  <li className={active === 'following' ? 'active' : ''}>
                    <Link to={`/browse/following/`}>
                      {'Following'}
                    </Link>
                  </li> : null
                }
                <li className={active === 'dev' ? 'active' : ''}>
                  <Link to={`/dev`}>
                    {'Dev'}
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
                    authentication={this.props.authentication}
                    active={this.props.visibility.uiPanels.user}
                    showLoginOverlay={this.showSignInUpOverlay}
                    toggleUserMenu={this.toggleUserPanel}
                  />
                  <UIPanel
                    id="user"
                    visibility={this.props.visibility.uiPanels}
                    bodyComponent={UserMenuBody}
                    showLoginOverlay={this.showSignInUpOverlay}
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
      </HigherOrder.ScrollAware>
    );
  }
}
