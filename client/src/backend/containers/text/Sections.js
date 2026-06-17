import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import OutletWithDrawers from "global/components/router/OutletWithDrawers";
import SectionsList from "backend/components/authoring/SectionsList";
import * as Styled from "./styles";

export default function TextSectionsContainer() {
  const { t } = useTranslation();
  const { text, refresh } = useOutletContext() || {};

  if (!text) return null;

  const closeUrl = lh.link("backendTextSections", text.id);

  const appliesToAllStylesheets = text.relationships.stylesheets
    ?.filter(s => s.attributes.appliesToAllTextSections)
    .map(s => s.id);

  // Each drawer context is mounted simultaneously (off-screen via `inert`) so
  // its focus trap and enter/exit animation stay stable across route changes.
  // The active route's `handle.drawer` string selects which one opens.
  const drawerProps = [
    {
      context: "editor",
      lockScroll: "always",
      wide: true,
      closeUrl,
      padding: "xl",
      entrySide: "top",
      fullScreenTitle: t("texts.edit_section"),
      icon: "annotate32"
    },
    {
      context: "ingestion",
      lockScroll: "always",
      closeUrl,
      size: "default",
      padding: "default"
    },
    {
      context: "backend",
      lockScroll: "always",
      closeUrl,
      size: "default",
      padding: "default"
    }
  ];

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
      <OutletWithDrawers drawerProps={drawerProps} context={context} />
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
