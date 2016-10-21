import React, { Component, PropTypes } from 'react';
import {
  AppearanceMenuButton,
  AppearanceMenuBody,
  TextTitles,
  TocDrawer
} from 'components/reader';
import {
  HeaderNotifications,
  SearchMenuButton,
  SearchMenuBody,
  UIPanel,
  UserMenuButton,
  UserMenuBody
} from 'components/global';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class Header extends Component {

  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    appearance: PropTypes.object,
    notifications: PropTypes.object,
    selectFont: PropTypes.func,
    incrementFontSize: PropTypes.func,
    decrementFontSize: PropTypes.func,
    incrementMargins: PropTypes.func,
    decrementMargins: PropTypes.func,
    setColorScheme: PropTypes.func,
    scrollAware: PropTypes.object,
    commonActions: PropTypes.object
  };

  constructor() {
    super();
    this.handleContentsButtonClick = this.handleContentsButtonClick.bind(this);
    this.handleSearchMenuButtonClick = this.handleSearchMenuButtonClick.bind(this);
    this.handleAppearanceMenuButtonClick = this.handleAppearanceMenuButtonClick.bind(this);
    this.triggerShowSignInUpOverlay = this.triggerShowSignInUpOverlay.bind(this);
    this.triggerToggleUserMenu = this.triggerToggleUserMenu.bind(this);
    this.triggerHideToc = this.triggerHideToc.bind(this);
    this.renderContentsButton = this.renderContentsButton.bind(this);
  }

  handleContentsButtonClick() {
    this.props.commonActions.visibilityToggle('tocDrawer');
  }

  handleSearchMenuButtonClick() {
    this.props.commonActions.panelToggle('search');
  }

  handleAppearanceMenuButtonClick() {
    this.props.commonActions.panelToggle('appearance');
  }

  triggerShowSignInUpOverlay() {
    this.props.commonActions.visibilityShow('signInUpOverlay');
  }

  triggerToggleUserMenu() {
    this.props.commonActions.panelToggle('user');
  }

  triggerHideToc() {
    this.props.commonActions.visibilityHide('tocDrawer');
  }

  renderContentsButton = (contents) => {
    if (contents.length <= 0) {
      return null;
    }

    const buttonIndexClass = classNames({
      'button-index': true,
      active: this.props.visibility.tocDrawer
    });

    return (
      <button className={buttonIndexClass} onClick={this.handleContentsButtonClick}>
        {'Contents'}<i className="manicon manicon-caret-down"></i>
      </button>
    );
  }

  render() {
    const colorScheme = this.props.appearance.colors.colorScheme;

    const bannerGradientClass = classNames({
      'banner-gradient': true,
      'scheme-light': colorScheme === 'light',
      'scheme-dark': colorScheme === 'dark'
    });

    return (
      <header className="header-reader">
        <nav className="container-banner">
          <Link to={`/browse/project/${this.props.text.relationships.project.id}`} >
            <button className="button-close" >
              <i className="manicon manicon-x"></i>
                <span className="screen-reader-text">
                  {'Click to close reader'}
                </span>
            </button>
          </Link>
          { this.renderContentsButton(this.props.text.attributes.toc) }
          { this.props.section ?
            <TextTitles
              textTitle={this.props.text.attributes.title}
              sectionTitle={this.props.section.attributes.name}
              showSection={!this.props.scrollAware.top}
            />
          : null }
          <nav className="menu-buttons">
            <ul>
              <li>
                <SearchMenuButton
                  toggleSearchMenu={this.handleSearchMenuButtonClick}
                  active={this.props.visibility.uiPanels.search}
                />
              </li>
              <li>
                <AppearanceMenuButton
                  toggleAppearanceMenu={this.handleAppearanceMenuButtonClick}
                  active={this.props.visibility.uiPanels.appearance}
                />
              </li>
              <li>
                <UserMenuButton
                  authentication={this.props.authentication}
                  active={this.props.visibility.uiPanels.user}
                  showLoginOverlay={this.triggerShowSignInUpOverlay}
                  toggleUserMenu={this.triggerToggleUserMenu}
                />
              </li>
            </ul>
          </nav>
        </nav>
        <div className={bannerGradientClass}></div>
        <TocDrawer
          text={this.props.text}
          visible={this.props.visibility.tocDrawer}
          hideTocDrawer={this.triggerHideToc}
        />
        <nav className="menu-panels">
          <UIPanel
            id="search"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={SearchMenuBody}
          />
          <UIPanel
            id="appearance"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={AppearanceMenuBody}

            // Props required by body component
            appearance={this.props.appearance}
            selectFont={this.props.selectFont}
            setColorScheme={this.props.setColorScheme}
            incrementFontSize={this.props.incrementFontSize}
            decrementFontSize={this.props.decrementFontSize}
            incrementMargins={this.props.incrementMargins}
            decrementMargins={this.props.decrementMargins}
          />
          <UIPanel
            id="user"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={UserMenuBody}
            showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
            startLogout={this.props.commonActions.logout}
            hideUserMenu={this.props.commonActions.toggleUserPanel}
          />
        </nav>
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
