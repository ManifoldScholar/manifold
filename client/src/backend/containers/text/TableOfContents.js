import React from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { childRoutes } from "helpers/router";

export default function TextTOCContainer({ text, refresh, route }) {
  const { t } = useTranslation();

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendTextTOC", text.id);

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        wide: true,
        lockScrollClickCloses: false,
        closeUrl
      },
      childProps: { refresh, text }
    });
  };

  // TODO: Add an Authorize with correct permission.

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
          label={t("backend_entities.texts.toc_header")}
          instructions={t("backend_entities.texts.toc_instructions")}
        />
        <div className="entity-list__button-set-flex full-width">
          <Link
            to={lh.link("backendTextTOCEntryEdit", text.id)}
            className="entity-list__button button-lozenge-secondary"
          >
            <span className="screen-reader-text">
              {t("backend_entities.texts.add_toc_button_label")}
            </span>
            <IconComposer
              icon="circlePlus32"
              size={18}
              className="button-icon-secondary__icon button-icon-secondary__icon--large"
            />
            <span className="full" aria-hidden="true">
              {t("backend_entities.texts.add_toc_button_label")}
            </span>
            <span className="abbreviated" aria-hidden="true">
              {t("backend_entities.texts.add_toc_truncated")}
            </span>
          </Link>
          <Link
            to={lh.link("backendTextSectionsNew", text.id)}
            className="entity-list__button button-lozenge-secondary"
          >
            <span className="screen-reader-text">
              {t("backend_entities.texts.auto_toc_button_label")}
            </span>
            <IconComposer
              icon="lightning24"
              size={18}
              className="button-icon-secondary__icon button-icon-secondary__icon--large"
            />
            <span className="full" aria-hidden="true">
              {t("backend_entities.texts.auto_toc_button_label")}
            </span>
            <span className="abbreviated" aria-hidden="true">
              {t("backend_entities.texts.auto_toc_truncated")}
            </span>
          </Link>
        </div>
      </FormContainer.Form>
    </section>
  );
}

TextTOCContainer.displayName = "Text.Sections";

TextTOCContainer.propTypes = {
  text: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};
