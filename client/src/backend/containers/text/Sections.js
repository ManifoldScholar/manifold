import React from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { childRoutes } from "helpers/router";
import SectionsList from "backend/components/authoring/SectionsList";
import * as Styled from "./styles";

export default function TextSectionsContainer({
  text,
  route: baseRoute,
  refresh
}) {
  const { t } = useTranslation();

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendTextSections", text.id);

    const { routes, ...route } = baseRoute;
    const drawerRoutes = { ...route, routes: routes.filter(r => !r.editor) };
    const editorRoute = { ...route, routes: [routes.find(r => r.editor)] };

    const appliesToAllStylesheets = text.relationships.stylesheets
      ?.filter(s => s.attributes.appliesToAllTextSections)
      .map(s => s.id);

    return (
      <>
        {childRoutes(editorRoute, {
          drawer: true,
          drawerProps: {
            lockScroll: "always",
            lockScrollClickCloses: false,
            wide: true,
            closeUrl,
            padding: "xl",
            context: "editor",
            entrySide: "top",
            fullScreenTitle: t("texts.edit_section"),
            icon: "annotate32"
          },
          childProps: {
            textId: text.id,
            appliesToAllStylesheets,
            nextPosition: text.attributes?.sectionsMap?.length + 1,
            refresh
          }
        })}
        {childRoutes(drawerRoutes, {
          drawer: true,
          drawerProps: {
            lockScroll: "always",
            lockScrollClickCloses: false,
            closeUrl,
            size: "default",
            padding: "default"
          },
          childProps: {
            textId: text.id,
            sectionIngest: true,
            nextPosition: text.attributes?.sectionsMap?.length + 1,
            startSectionId: text?.attributes?.startTextSectionId,
            refresh
          }
        })}
      </>
    );
  };

  return (
    <section>
      {renderChildRoutes()}
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

TextSectionsContainer.propTypes = {
  text: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};
