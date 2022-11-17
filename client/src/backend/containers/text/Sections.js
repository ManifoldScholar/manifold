import React from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { childRoutes } from "helpers/router";
import SectionsList from "backend/components/authoring/SectionsList";

export default function TextSectionsContainer({ text, refresh, route }) {
  const { t } = useTranslation();

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendTextSections", text.id);

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        lockScrollClickCloses: false,
        closeUrl,
        size: "authoring",
        padding: "authoring"
      },
      childProps: { refresh, text }
    });
  };

  return (
    <section>
      {renderChildRoutes()}
      <FormContainer.Form
        className="form-secondary"
        doNotWarn
        groupErrors
        model={text}
        name="backend-text-sections"
      >
        <Form.Header
          label={t("glossary.section_title_case_other")}
          instructions={t("backend_entities.texts.sections_instructions")}
        />
        <div className="entity-list__button-set-flex full-width">
          <Link
            to={lh.link("backendTextSectionsNew", text.id)}
            className="entity-list__button button-lozenge-secondary"
          >
            <span className="screen-reader-text">
              {t("backend_entities.texts.create_category_button_label")}
            </span>
            <IconComposer
              icon="circlePlus32"
              size={18}
              className="button-icon-secondary__icon button-icon-secondary__icon--large"
            />
            <span className="full" aria-hidden="true">
              {t("backend_entities.texts.add_section_button_label")}
            </span>
            <span className="abbreviated" aria-hidden="true">
              {t("glossary.section_title_case_one")}
            </span>
          </Link>
        </div>
        <SectionsList
          textId={text?.id}
          sections={text?.attributes?.sectionsMap}
          startSectionId={text?.attributes?.startTextSectionId}
        />
      </FormContainer.Form>
    </section>
  );
}

TextSectionsContainer.displayName = "Text.Sections";

TextSectionsContainer.propTypes = {
  text: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};
