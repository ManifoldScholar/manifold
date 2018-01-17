import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { ReturnMenu, TextTitles, Notes } from "components/reader";
import { ControlMenu } from "components/reader";
import {
  HeaderNotifications,
  UIPanel,
  UserMenuButton,
  UserMenuBody
} from "components/global";
import { HigherOrder } from "containers/global";
import memoize from "lodash/memoize";
import classNames from "classnames";

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
    commonActions: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object
  };

  componentWillUnmount() {
    this.resetHeaderState();
  }

  resetHeaderState() {
    this.triggerHideToc();
  }

  handleContentsButtonClick = () => {
    this.props.commonActions.visibilityToggle("tocDrawer");
  };

  triggerHideToc = () => {
    this.props.commonActions.visibilityHide("tocDrawer");
  };

  triggerShowSignInUpOverlay = () => {
    this.props.commonActions.visibilityShow("signInUpOverlay");
  };

  handleVisibilityFilterChange = filters => {
    this.props.commonActions.visibilityChange({ visibilityFilters: filters });
  };

  panelToggleHandler = memoize(panel => {
    return () => {
      this.triggerHideToc();
      this.props.commonActions.panelToggle(panel);
    };
  });

  renderContentsButton = contents => {
    if (contents.length <= 0) {
      return null;
    }

    const buttonIndexClass = classNames({
      "button-index": true,
      active: this.props.visibility.tocDrawer
    });

    return (
      <button
        className={buttonIndexClass}
        onClick={this.handleContentsButtonClick}
      >
        {"Contents"}
        <i className="manicon manicon-caret-down" />
      </button>
    );
  };

  render() {
    const containerClass = classNames("container-banner", {
      border: this.props.scrollAware && !this.props.scrollAware.top
    });

    return (
      <header className="header-reader">
        <nav className={containerClass}>
          <ReturnMenu.Button
            toggleReaderMenu={this.panelToggleHandler("readerReturn")}
          />
          {this.renderContentsButton(this.props.text.attributes.toc)}
          {this.props.section
            ? <TextTitles
                textTitle={this.props.text.attributes.title}
                sectionTitle={this.props.section.attributes.name}
                showSection={!this.props.scrollAware.top}
              />
            : null}
          <nav className="menu-buttons">
            <ul>
              <HigherOrder.RequireRole requiredRole={"any"}>
                <li>
                  <ControlMenu.NotesButton
                    toggle={this.panelToggleHandler("notes")}
                    active={this.props.visibility.uiPanels.notes}
                  />
                </li>
              </HigherOrder.RequireRole>
              <li>
                <ControlMenu.VisibilityMenuButton
                  toggle={this.panelToggleHandler("visibility")}
                  active={this.props.visibility.uiPanels.visibility}
                />
              </li>
              <li>
                <ControlMenu.AppearanceMenuButton
                  toggleAppearanceMenu={this.panelToggleHandler("appearance")}
                  active={this.props.visibility.uiPanels.appearance}
                />
              </li>
              {/* <li>
                <SearchMenuButton
                  toggleSearchMenu={this.handleSearchMenuButtonClick}
                  active={this.props.visibility.uiPanels.search}
                />
              </li>*/}
              <li>
                <UserMenuButton
                  authentication={this.props.authentication}
                  active={this.props.visibility.uiPanels.user}
                  showLoginOverlay={this.triggerShowSignInUpOverlay}
                  toggleUserMenu={this.panelToggleHandler("user")}
                />
              </li>
            </ul>
          </nav>
        </nav>
        <nav className="menu-panels-left">
          <UIPanel
            id="readerReturn"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={ReturnMenu.Body}
            returnUrl={lh.link(
              "frontendProject",
              this.props.text.relationships.project.attributes.slug
            )}
            projectId={this.props.text.relationships.project.id}
            projectTitle={
              this.props.text.relationships.project.attributes.title
            }
            toggleSignInUpOverlay={
              this.props.commonActions.toggleSignInUpOverlay
            }
            // TODO: More link (and eventually, the link text) should be pulled from settings
            moreLink="http://manifold.umn.edu/about/"
          />
        </nav>

        <nav className="menu-panels-right">
          <UIPanel
            id="notes"
            visibility={this.props.visibility.uiPanels}
            visible={this.props.visibility.uiPanels.notes}
            bodyComponent={Notes.ReaderDrawer}
          />
          <UIPanel
            id="visibility"
            visibility={this.props.visibility.uiPanels}
            filter={this.props.visibility.visibilityFilters}
            filterChangeHandler={this.handleVisibilityFilterChange}
            bodyComponent={ControlMenu.VisibilityMenuBody}
          />
          <UIPanel
            id="appearance"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={ControlMenu.AppearanceMenuBody}
            // Props required by body component
            appearance={this.props.appearance}
            selectFont={this.props.selectFont}
            setColorScheme={this.props.setColorScheme}
            incrementFontSize={this.props.incrementFontSize}
            decrementFontSize={this.props.decrementFontSize}
            incrementMargins={this.props.incrementMargins}
            decrementMargins={this.props.decrementMargins}
          />
          {/* <UIPanel
            id="search"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={SearchMenuBody}
          />*/}
          <UIPanel
            id="user"
            visibility={this.props.visibility.uiPanels}
            bodyComponent={UserMenuBody}
            // Props required by body component
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
