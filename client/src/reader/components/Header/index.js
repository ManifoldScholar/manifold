import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
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
import Authorize from "hoc/Authorize";
import { commonActions } from "actions/helpers";
import { useFromStore } from "hooks";

export default function Header({ text, scrollAware }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { sectionId } = useParams();

  const section = useFromStore({
    entityType: "textSections",
    action: "grab",
    id: sectionId
  });
  const visibility = useFromStore({ path: "ui.transitory.visibility" });
  const appearance = useFromStore({ path: "ui.persistent.reader" });

  const actions = commonActions(dispatch);

  const handleContentsButtonClick = event => {
    event.stopPropagation();
    actions.panelToggle("tocDrawer");
  };

  const handleVisibilityFilterChange = filters => {
    actions.visibilityChange({ visibilityFilters: filters });
  };

  const panelToggleHandler = memoize(panel => {
    return () => {
      actions.panelToggle(panel);
    };
  });

  const renderContentsButton = textAttrs => {
    if (textAttrs?.toc.length <= 0 && isEmpty(textAttrs?.metadata)) {
      return null;
    }

    const buttonClassName = classNames({
      "reader-header__button": true,
      "reader-header__button--gray": true,
      "reader-header__button--pad-default": true,
      "button-active": visibility?.uiPanels?.tocDrawer
    });

    return (
      <button
        id="toc-drawer-toggle"
        className={buttonClassName}
        onClick={handleContentsButtonClick}
        aria-haspopup
        aria-expanded={visibility?.uiPanels?.tocDrawer}
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
              onClick={panelToggleHandler("notes")}
              icon="notes24"
              label={t("glossary.note_title_case_other")}
              active={visibility?.uiPanels?.notes}
              ariaHasPopup="dialog"
              ariaControls="notes"
            />
          </li>
        </Authorize>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            visible={visibility?.uiPanels?.visibility}
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
                filter={visibility?.visibilityFilters}
                filterChangeHandler={handleVisibilityFilterChange}
              />
            </ControlMenu.DisclosurePanel>
          </DisclosureNavigationMenu>
        </li>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            visible={visibility?.uiPanels?.appearance}
            disclosure={
              <ControlMenu.DisclosureButton
                icon="text24"
                label={t("reader.header.reader_appearance")}
              />
            }
          >
            <ControlMenu.DisclosurePanel direction="right">
              <ControlMenu.AppearanceMenuBody
                appearance={appearance}
                className="panel"
              />
            </ControlMenu.DisclosurePanel>
          </DisclosureNavigationMenu>
        </li>
        <li className="reader-header__nav-item">
          <DisclosureNavigationMenu
            visible={visibility?.uiPanels?.search}
            disclosure={
              <ControlMenu.DisclosureButton
                icon="search24"
                label={t("search.title")}
              />
            }
          >
            <ControlMenu.DisclosurePanel direction="right">
              <SearchMenu.Body
                afterSubmit={panelToggleHandler("search")}
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
            visible={visibility?.uiPanels?.user}
            disclosure={<UserMenuButton />}
            callbacks={actions}
            onBlur={actions.hideUserPanel}
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
            toggleReaderMenu={panelToggleHandler("readerReturn")}
            expanded={visibility?.uiPanels?.readerReturn}
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
              visibility={visibility?.uiPanels}
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
              toggleSignInUpOverlay={actions.toggleSignInUpOverlay}
              hidePanel={actions.hideReaderReturnPanel}
              moreLink="https://manifoldapp.org/"
            />
          </div>

          <div className="reader-header__panels reader-header__panels--right">
            <UIPanel
              id="notes"
              visibility={visibility?.uiPanels}
              visible={visibility?.uiPanels?.notes}
              bodyComponent={Notes.ReaderDrawer}
              hidePanel={actions.hideNotesPanel}
            />
          </div>
        </>
      ) : (
        <div className="reader-header__panels reader-header__panels--left">
          <UIPanel
            id="readerReturn"
            visibility={visibility?.uiPanels}
            bodyComponent={ReturnMenu.Body}
            toggleSignInUpOverlay={commonActions.toggleSignInUpOverlay}
            hidePanel={commonActions.hideReaderReturnPanel}
            moreLink="https://manifoldapp.org/"
          />
        </div>
      )}
      <HeaderNotifications />
    </header>
  );
}

Header.displayName = "Reader.Header";
