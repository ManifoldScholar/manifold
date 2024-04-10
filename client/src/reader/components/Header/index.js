import React, { useState, useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import ControlMenu from "reader/components/control-menu";
import Notes from "reader/components/notes";
import TextTitles from "reader/components/TextTitles";
import ReturnMenu from "reader/components/return-menu";
import SearchMenu from "global/components/search/menu";
import HeaderNotifications from "global/components/HeaderNotifications";
import UserMenuBody from "global/components/UserMenuBody";
import UserMenuButton from "global/components/UserMenuButton";
import UIPanel from "global/components/UIPanel";
import Layout from "reader/components/layout";
import memoize from "lodash/memoize";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import Utility from "global/components/utility";
import DisclosureNavigationMenu from "global/components/atomic/DisclosureNavigationMenu";
import { useTranslation } from "react-i18next";
import Authorize from "hoc/Authorize";

export default function Header(props) {
  const {
    match,
    history,
    text,
    section,
    commonActions,
    visibility,
    scrollAware,
    appearance,
    selectFont,
    setColorScheme,
    incrementFontSize,
    decrementFontSize,
    incrementMargins,
    decrementMargins,
    resetTypography
  } = props;
  const { t } = useTranslation();
  const [mobileOptionsExpanded, setExpanded] = useState(false);
  const breakpoint = useRef(560);
  const resizeId = useRef(null);

  const projectId = text?.relationships?.project?.id;
  const textId = text?.id;
  const sectionId = section?.id;

  const handleContentsButtonClick = event => {
    event.stopPropagation();
    commonActions.panelToggle("tocDrawer");
  };

  const handleVisibilityFilterChange = filters => {
    commonActions.visibilityChange({ visibilityFilters: filters });
  };

  const panelToggleHandler = memoize(panel => {
    return () => {
      commonActions.panelToggle(panel);
    };
  });

  const handleOptionsToggleClick = () => {
    setExpanded(!mobileOptionsExpanded);
  };

  const handleResize = useCallback(() => {
    if (resizeId.current) {
      window.cancelAnimationFrame(resizeId.current);
    }

    resizeId.current = window.requestAnimationFrame(() => {
      if (window.innerWidth < breakpoint.current || !mobileOptionsExpanded)
        return null;

      setExpanded(false);
    });
  }, [mobileOptionsExpanded]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  const renderOptionsToggle = () => {
    return (
      <button
        onClick={handleOptionsToggleClick}
        aria-hidden
        tabIndex={-1}
        className="reader-header__button reader-header__options-button"
      >
        <span>
          {mobileOptionsExpanded
            ? t("actions.close")
            : t("glossary.option_title_case_other")}
        </span>
        {mobileOptionsExpanded ? (
          <Utility.IconComposer
            icon="close32"
            size="default"
            className="reader-header__options-button-icon"
          />
        ) : (
          <Utility.IconComposer
            icon="menu32"
            size="default"
            className="reader-header__options-button-icon reader-header__options-button-icon--options"
          />
        )}
      </button>
    );
  };

  const renderContentsButton = textAttrs => {
    if (textAttrs.toc.length <= 0 && isEmpty(textAttrs.metadata)) {
      return null;
    }

    const buttonClassName = classNames({
      "reader-header__button": true,
      "reader-header__button--gray": true,
      "reader-header__button--pad-default": true,
      "button-active": visibility.uiPanels.tocDrawer
    });

    return (
      <button
        id="toc-drawer-toggle"
        className={buttonClassName}
        onClick={handleContentsButtonClick}
        aria-haspopup
        aria-expanded={visibility.uiPanels.tocDrawer}
      >
        <span className="reader-header__button-text reader-header__button-text--dark">
          {t("reader.header.contents")}
        </span>
        <Utility.IconComposer
          icon="disclosureDown24"
          size="default"
          className="reader-header__button-icon reader-header__button-icon--large"
        />
        <Utility.IconComposer
          icon="disclosureDown16"
          size={20}
          className="reader-header__button-icon reader-header__button-icon--small"
        />
      </button>
    );
  };

  const innerClassName = classNames({
    "reader-header__inner": true,
    "reader-header__inner--shifted": mobileOptionsExpanded
  });
  return (
    <header className="reader-header">
      <Layout.PreHeader />
      <nav className={innerClassName}>
        <div className="reader-header__menu-group reader-header__menu-group--left">
          <ReturnMenu.Button
            toggleReaderMenu={panelToggleHandler("readerReturn")}
            expanded={visibility.uiPanels.readerReturn}
          />
          {renderContentsButton(text.attributes)}
        </div>
        {section && (
          <TextTitles
            text={text}
            section={section}
            showSection={!scrollAware.top}
          />
        )}
        <div className="reader-header__menu-group reader-header__menu-group--right">
          <ul
            aria-label={t("reader.header.reader_settings_search")}
            className="reader-header__nav-list"
          >
            <Authorize kind={"any"}>
              <li className="reader-header__nav-item">
                <ControlMenu.Button
                  onClick={panelToggleHandler("notes")}
                  icon="notes24"
                  label={t("glossary.note_title_case_other")}
                  active={visibility.uiPanels.notes}
                />
              </li>
            </Authorize>
            <li className="reader-header__nav-item">
              <ControlMenu.Button
                onClick={panelToggleHandler("visibility")}
                icon="eyeball24"
                label={t("common.visibility_title_case")}
                active={visibility.uiPanels.visibility}
              />
            </li>
            <li className="reader-header__nav-item">
              <ControlMenu.Button
                onClick={panelToggleHandler("appearance")}
                icon="text24"
                label={t("reader.header.reader_appearance")}
                active={visibility.uiPanels.appearance}
              />
            </li>
            <li className="reader-header__nav-item">
              <SearchMenu.Button
                toggleSearchMenu={panelToggleHandler("search")}
                active={visibility.uiPanels.search}
                className="reader-header__button reader-header__button--pad-narrow"
                iconSize={32}
              />
            </li>
            <li className="reader-header__nav-item">
              <DisclosureNavigationMenu
                visible={visibility.uiPanels.user}
                disclosure={<UserMenuButton />}
                callbacks={commonActions}
                onBlur={commonActions.hideUserPanel}
                context="reader"
              >
                <UserMenuBody />
              </DisclosureNavigationMenu>
            </li>
          </ul>
        </div>
      </nav>
      <div className="reader-header__panels reader-header__panels--left">
        <UIPanel
          id="readerReturn"
          visibility={visibility.uiPanels}
          bodyComponent={ReturnMenu.Body}
          returnUrl={lh.link(
            "frontendProjectDetail",
            text.relationships.project.attributes.slug
          )}
          projectId={text.relationships.project.id}
          projectTitle={text.relationships.project.attributes.titleFormatted}
          isJournalArticle={
            text.relationships.project.attributes.isJournalIssue
          }
          toggleSignInUpOverlay={commonActions.toggleSignInUpOverlay}
          hidePanel={commonActions.hideReaderReturnPanel}
          // TODO: More link (and eventually, the link text) should be pulled from settings
          moreLink="https://manifoldapp.org/"
        />
      </div>

      <div className="reader-header__panels reader-header__panels--right">
        <UIPanel
          id="notes"
          visibility={visibility.uiPanels}
          visible={visibility.uiPanels.notes}
          bodyComponent={Notes.ReaderDrawer}
          match={match}
          history={history}
          hidePanel={commonActions.hideNotesPanel}
        />
        <UIPanel
          id="visibility"
          visibility={visibility.uiPanels}
          filter={visibility.visibilityFilters}
          filterChangeHandler={handleVisibilityFilterChange}
          bodyComponent={ControlMenu.VisibilityMenuBody}
          hidePanel={commonActions.hideVisibilityPanel}
        />
        <UIPanel
          id="search"
          visibility={visibility.uiPanels}
          toggleVisibility={panelToggleHandler("search")}
          initialState={{
            keyword: "",
            scope: "text"
          }}
          projectId={projectId}
          textId={textId}
          sectionId={sectionId}
          searchType="reader"
          bodyComponent={SearchMenu.Body}
          hidePanel={commonActions.hideSearchPanel}
        />
        <UIPanel
          id="appearance"
          visibility={visibility.uiPanels}
          bodyComponent={ControlMenu.AppearanceMenuBody}
          // Props required by body component
          appearance={appearance}
          selectFont={selectFont}
          setColorScheme={setColorScheme}
          incrementFontSize={incrementFontSize}
          decrementFontSize={decrementFontSize}
          incrementMargins={incrementMargins}
          decrementMargins={decrementMargins}
          resetTypography={resetTypography}
          hidePanel={commonActions.hideAppearancePanel}
        />
      </div>
      {renderOptionsToggle()}
      <HeaderNotifications />
    </header>
  );
}

Header.displayName = "Reader.Header";

Header.propTypes = {
  text: PropTypes.object,
  section: PropTypes.object,
  visibility: PropTypes.object,
  appearance: PropTypes.object,
  selectFont: PropTypes.func,
  incrementFontSize: PropTypes.func,
  decrementFontSize: PropTypes.func,
  incrementMargins: PropTypes.func,
  decrementMargins: PropTypes.func,
  resetTypography: PropTypes.func,
  setColorScheme: PropTypes.func,
  scrollAware: PropTypes.object,
  commonActions: PropTypes.object,
  match: PropTypes.object
};
