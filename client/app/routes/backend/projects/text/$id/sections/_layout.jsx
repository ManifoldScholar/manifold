import Form from "components/global/form";
import { useTranslation } from "react-i18next";
import { Link, useOutletContext } from "react-router";
import IconComposer from "components/global/utility/IconComposer";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import SectionsList from "components/backend/authoring/SectionsList";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "components/global/dialog";
import * as Styled from "./styles";

export default function TextSectionsLayout() {
  const { t } = useTranslation();
  const text = useOutletContext();
  const { confirm, confirmation } = useConfirmation();

  const closeUrl = `/backend/projects/text/${text.id}/sections`;

  const drawerProps = [
    {
      lockScroll: "always",
      wide: true,
      closeUrl,
      padding: "xl",
      context: "editor",
      entrySide: "top",
      fullScreenTitle: t("texts.edit_section"),
      icon: "annotate32"
    },
    {
      lockScroll: "always",
      closeUrl,
      size: "default",
      padding: "default",
      context: "ingestion"
    },
    {
      lockScroll: "always",
      closeUrl,
      size: "default",
      padding: "default",
      context: "backend"
    }
  ];

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers drawerProps={drawerProps} context={text} />
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
            to={`/backend/projects/text/${text.id}/sections/ingestions/new`}
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
            to={`/backend/projects/text/${text.id}/sections/new`}
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
          confirm={confirm}
        />
      </Styled.Form>
    </section>
  );
}
