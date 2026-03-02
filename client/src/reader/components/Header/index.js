import { useContext, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import Utility from "global/components/utility";
import DisclosureNavigationMenu from "global/components/atomic/DisclosureNavigationMenu";
import Authorize from "hoc/Authorize";
import { useLogout, useLoaderEntity } from "hooks";
import useScrollAware from "hooks/useScrollAware";
import { ReaderContext } from "app/contexts";

export default function Header() {
  const scrollAware = useScrollAware();
  const { t } = useTranslation();
  const logout = useLogout();
  const text = useLoaderEntity("texts");
  const section = useLoaderEntity("textSections");

  const { panels, visibilityFilters, dispatch } = useContext(ReaderContext);

  const togglePanel = useCallback(
    panel => dispatch({ type: "PANEL_TOGGLE", payload: panel }),
    [dispatch]
  );

  const hidePanel = useCallback(
    panel => dispatch({ type: "PANEL_HIDE", payload: panel }),
    [dispatch]
  );

  const handleContentsButtonClick = event => {
    event.stopPropagation();
    togglePanel("tocDrawer");
  };

  const handleVisibilityFilterChange = filters => {
    dispatch({ type: "VISIBILITY_FILTERS_CHANGE", payload: filters });
  };

  const renderContentsButton = textAttrs => {
    if (textAttrs?.toc.length <= 0 && isEmpty(textAttrs?.metadata)) {
      return null;
    }

    const buttonClassName = classNames({
      "reader-header__button": true,
      "reader-header__button--gray": true,
      "reader-header__button--pad-default": true,
      "button-active": panels?.tocDrawer
    });

    return (
      <button
        id="toc-drawer-toggle"
        className={buttonClassName}
        onClick={handleContentsButtonClick}
        aria-haspopup
        aria-expanded={panels?.tocDrawer}
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

  const renderOptionsNav = () => {
    return (
      <ul
        aria-label={t("reader.header.reader_settings_search")}
        className="reader-header__nav-list"
      >
        <Authorize kind={"any"}>
          <li className="reader-header__nav-item">
            <ControlMenu.Button
              onClick={() => togglePanel("notes")}
              icon="notes24"
              label={t("glossary.note_title_case_other")}
              active={panels?.notes}
              ariaHasPopup="dialog"
              ariaControls="notes"
            />
          </li>
        </Authorize>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            disclosure={
              <ControlMenu.DisclosureButton
                icon="eyeball24"
                label={t("common.visibility_title_case")}
              />
            }
          >
            <ControlMenu.DisclosurePanel direction="right">
              <ControlMenu.VisibilityMenuBody
                className="panel"
                filter={visibilityFilters}
                filterChangeHandler={handleVisibilityFilterChange}
              />
            </ControlMenu.DisclosurePanel>
          </DisclosureNavigationMenu>
        </li>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            disclosure={
              <ControlMenu.DisclosureButton
                icon="text24"
                label={t("reader.header.reader_appearance")}
              />
            }
          >
            <ControlMenu.DisclosurePanel direction="right">
              <ControlMenu.AppearanceMenuBody className="panel" />
            </ControlMenu.DisclosurePanel>
          </DisclosureNavigationMenu>
        </li>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            disclosure={
              <ControlMenu.DisclosureButton
                icon="search24"
                label={t("search.title")}
              />
            }
          >
            <ControlMenu.DisclosurePanel direction="right">
              <SearchMenu.Body
                initialState={{
                  keyword: "",
                  scope: "text"
                }}
                projectId={text?.relationships?.project?.id}
                textId={text?.id}
                sectionId={section?.id}
                searchType="reader"
                className="panel search-menu"
              />
            </ControlMenu.DisclosurePanel>
          </DisclosureNavigationMenu>
        </li>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            disclosure={<UserMenuButton />}
            logout={logout}
            context="reader"
          >
            <UserMenuBody />
          </DisclosureNavigationMenu>
        </li>
      </ul>
    );
  };

  return (
    <header className="reader-header">
      <Layout.PreHeader />
      <nav className="reader-header__inner">
        <div className="reader-header__menu-group reader-header__menu-group--left">
          <ReturnMenu.Button
            toggleReaderMenu={() => togglePanel("readerReturn")}
            expanded={panels?.readerReturn}
          />
          {renderContentsButton(text?.attributes)}
        </div>
        {section && (
          <TextTitles
            text={text}
            section={section}
            showSection={!scrollAware?.top}
          />
        )}
        <div className="reader-header__menu-group reader-header__menu-group--right">
          {renderOptionsNav()}
        </div>
      </nav>
      {text ? (
        <>
          <div className="reader-header__panels reader-header__panels--left">
            <UIPanel
              id="readerReturn"
              visibility={panels}
              bodyComponent={ReturnMenu.Body}
              returnUrl={lh.link(
                "frontendProjectDetail",
                text?.relationships.project.attributes.slug
              )}
              projectId={text?.relationships.project.id}
              projectTitle={
                text?.relationships.project.attributes.titleFormatted
              }
              isJournalArticle={
                text?.relationships.project.attributes.isJournalIssue
              }
              hidePanel={() => hidePanel("readerReturn")}
              moreLink="https://manifoldapp.org/"
            />
          </div>

          <div className="reader-header__panels reader-header__panels--right">
            <UIPanel
              id="notes"
              visibility={panels}
              visible={panels?.notes}
              bodyComponent={Notes.ReaderDrawer}
              hidePanel={() => hidePanel("notes")}
            />
          </div>
        </>
      ) : (
        <div className="reader-header__panels reader-header__panels--left">
          <UIPanel
            id="readerReturn"
            visibility={panels}
            bodyComponent={ReturnMenu.Body}
            hidePanel={() => hidePanel("readerReturn")}
            moreLink="https://manifoldapp.org/"
          />
        </div>
      )}
      <HeaderNotifications />
    </header>
  );
}

Header.displayName = "Reader.Header";
