import React, { Component, PropTypes } from 'react';
import {
    HeaderNotifications,
    HigherOrder,
    SearchMenuBody,
    SearchMenuButton,
    UIPanel,
    UserMenuBody,
    UserMenuButton
} from 'components/global';
import { Link } from 'react-router';
import startsWith from 'lodash/startsWith';

export default class LayoutHeader extends Component {

  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object
  };

  render() {
    const path = this.props.location.pathname;
    const active = startsWith(path, '/browse/following') ? 'following' : 'browse';
    return (
      <header className={'header-app'}>
        <div className="header-container">
          <Link to={'/browse'} className="logo">
            <figure>
              <i className="manicon manicon-manifold-logo"></i>
              <span className="screen-reader-text">
                {'Manifold Logo: Click to return to the browse page'}
              </span>
            </figure>
          </Link>
          {/* Use show-50 utility class to hide text-nav on mobile */}
          <nav className="text-nav show-50">
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
            </ul>
          </nav>

          <nav className="menu-dropdowns">
            <ul>
              {
                this.props.authentication.authenticated ?
                  <li>
                    <Link className="button-mode" to={`/backend`}>
                      Admin Mode
                    </Link>
                  </li> : null
              }
              <li>
                <SearchMenuButton
                  toggleSearchMenu={this.props.commonActions.toggleSearchPanel}
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
                  showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
                  toggleUserMenu={this.props.commonActions.toggleUserPanel}
                />
                <UIPanel
                  id="user"
                  visibility={this.props.visibility.uiPanels}
                  bodyComponent={UserMenuBody}
                  showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
                  startLogout={this.props.commonActions.logout}
                  hideUserMenu={this.props.commonActions.toggleUserPanel}
                />
              </li>
            </ul>
          </nav>
        </div>

        <div className="header-border"></div>

        <HeaderNotifications
          notifications={this.props.notifications}
          addNotification={this.props.commonActions.addNotification}
          removeNotification={this.props.commonActions.removeNotification}
          removeAllNotifications={this.props.commonActions.clearNotifications}
        />
      </header>
    );
  }
}
