import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext, useMatches } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import SectionsList from "backend/components/authoring/SectionsList";
import * as Styled from "./styles";

export default function TextSectionsContainer() {
  const { t } = useTranslation();
  const { text, refresh } = useOutletContext() || {};
  const matches = useMatches();

  if (!text) return null;

  const closeUrl = lh.link("backendTextSections", text.id);
  const currentMatch = matches[matches.length - 1];
  const isEditorRoute = currentMatch?.handle?.editor;
  const isIngestRoute = currentMatch?.handle?.ingest;

  const appliesToAllStylesheets = text.relationships.stylesheets
    ?.filter(s => s.attributes.appliesToAllTextSections)
    .map(s => s.id);

  const getDrawerProps = () => {
    if (isEditorRoute) {
      return {
        lockScroll: "always",
        lockScrollClickCloses: false,
        wide: true,
        closeUrl,
        padding: "xl",
        context: "editor",
        entrySide: "top",
        fullScreenTitle: t("texts.edit_section"),
        icon: "annotate32"
      };
    }
    if (isIngestRoute) {
      return {
        lockScroll: "always",
        lockScrollClickCloses: false,
        closeUrl,
        size: "default",
        padding: "default",
        context: "ingestion"
      };
    }
    return {
      lockScroll: "always",
      lockScrollClickCloses: false,
      closeUrl,
      size: "default",
      padding: "default"
    };
  };

  const context = {
    textId: text.id,
    appliesToAllStylesheets,
    nextPosition: text.attributes?.sectionsMap?.length + 1,
    startSectionId: text?.attributes?.startTextSectionId,
    sectionIngest: true,
    refresh
  };

  return (
    <section>
      <OutletWithDrawer drawerProps={getDrawerProps()} context={context} />
      <Styled.Form
        className="form-secondary"
        doNotWarn
        groupErrors
        model={text}
        name="backend-text-sections"
      >
        <Form.Header
          label={t("glossary.section_title_case_other")}
          instructions={t("texts.sections_instructions")}
        />
        <div className="entity-list__button-set-flex full-width">
          <Link
            to={lh.link("backendTextSectionIngest", text.id)}
            className="entity-list__button button-lozenge-secondary"
          >
            <span className="screen-reader-text">
              {t("texts.section.ingest_button_label")}
            </span>
            <IconComposer
              icon="export24"
              size={16}
              className="button-icon-secondary__icon button-icon-secondary__icon--large"
            />
            <span className="full" aria-hidden="true">
              {t("texts.section.ingest_button_label")}
            </span>
          </Link>
          <Link
            to={lh.link("backendTextSectionNew", text.id)}
            className="entity-list__button button-lozenge-secondary"
          >
            <span className="screen-reader-text">
              {t("texts.create_category_button_label")}
            </span>
            <IconComposer
              icon="circlePlus32"
              size={18}
              className="button-icon-secondary__icon button-icon-secondary__icon--large"
            />
            <span className="full" aria-hidden="true">
              {t("texts.add_section_button_label")}
            </span>
          </Link>
        </div>
        <SectionsList
          textId={text?.id}
          sections={text?.attributes?.sectionsMap}
          startSectionId={text?.attributes?.startTextSectionId}
          refresh={refresh}
        />
      </Styled.Form>
    </section>
  );
}

TextSectionsContainer.displayName = "Text.Sections";
