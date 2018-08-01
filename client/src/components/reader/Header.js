import React, { Component } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { ReturnMenu, TextTitles, Notes, ControlMenu } from "components/reader";
import {
  UIPanel,
  UserMenuButton,
  UserMenuBody,
  HeaderNotifications,
  Search
} from "components/global";
import { HigherOrder } from "containers/global";
import memoize from "lodash/memoize";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";

export default class Header extends Component {
  static propTypes = {
    text: PropTypes.object,
    section: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    location: PropTypes.object,
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

  renderContentsButton = textAttrs => {
    if (textAttrs.toc.length <= 0 && isEmpty(textAttrs.metadata)) {
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
        <i className="manicon manicon-caret-down" aria-hidden="true" />
      </button>
    );
  };

  render() {
    const colors = this.props.appearance.colors;

    // Conditional header class to apply color scheme
    const headerClass = classNames("header-reader", {
      "scheme-light": colors.colorScheme === "light",
      "scheme-dark": colors.colorScheme === "dark"
    });

    const containerClass = classNames("container-banner", {
      border: this.props.scrollAware && !this.props.scrollAware.top
    });

    return (
      <HigherOrder.BlurOnLocationChange location={this.props.location}>
        <header className={headerClass}>
          <nav className={containerClass}>
            <ReturnMenu.Button
              toggleReaderMenu={this.panelToggleHandler("readerReturn")}
            />
            {this.renderContentsButton(this.props.text.attributes)}
            {this.props.section ? (
              <TextTitles
                textTitle={this.props.text.attributes.title}
                sectionTitle={this.props.section.attributes.name}
                showSection={!this.props.scrollAware.top}
              />
            ) : null}
            <nav className="menu-buttons">
              <ul>
                <HigherOrder.Authorize kind={"any"}>
                  <li>
                    <ControlMenu.NotesButton
                      toggle={this.panelToggleHandler("notes")}
                      active={this.props.visibility.uiPanels.notes}
                    />
                  </li>
                </HigherOrder.Authorize>
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
                <li>
                  <Search.Menu.Button
                    toggleSearchMenu={this.panelToggleHandler("search")}
                    active={this.props.visibility.uiPanels.search}
                  />
                </li>
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
              hidePanel={this.props.commonActions.hideReaderReturnPanel}
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
              hidePanel={this.props.commonActions.hideNotesPanel}
            />
            <UIPanel
              id="visibility"
              visibility={this.props.visibility.uiPanels}
              filter={this.props.visibility.visibilityFilters}
              filterChangeHandler={this.handleVisibilityFilterChange}
              bodyComponent={ControlMenu.VisibilityMenuBody}
              hidePanel={this.props.commonActions.hideVisibilityPanel}
            />
            <UIPanel
              id="search"
              visibility={this.props.visibility.uiPanels}
              toggleVisibility={this.panelToggleHandler("search")}
              scopes={[
                { label: "Chapter", value: "section" },
                { label: "Text", value: "text" },
                { label: "Project", value: "project" }
              ]}
              initialState={{
                keyword: "",
                scope: "text",
                facets: ["SearchableNode", "Annotation"]
              }}
              searchType="reader"
              bodyComponent={Search.Menu.Body}
              hidePanel={this.props.commonActions.hideSearchPanel}
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
              hidePanel={this.props.commonActions.hideAppearancePanel}
            />
            <UIPanel
              id="user"
              visibility={this.props.visibility.uiPanels}
              bodyComponent={UserMenuBody}
              // Props required by body component
              showLoginOverlay={this.props.commonActions.toggleSignInUpOverlay}
              startLogout={this.props.commonActions.logout}
              hideUserMenu={this.props.commonActions.toggleUserPanel}
              hidePanel={this.props.commonActions.toggleUserPanel}
            />
          </nav>
          <HeaderNotifications />
        </header>
      </HigherOrder.BlurOnLocationChange>
    );
  }
}
