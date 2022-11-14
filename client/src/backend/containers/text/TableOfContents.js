import React, { useState } from "react";
import Form from "global/components/form";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { childRoutes } from "helpers/router";
import TOCList from "backend/components/authoring/TOCList";
import { formatTreeData } from "backend/components/authoring/TOCList/treeHelpers";

export default function TextTOCContainer({ text, route }) {
  const { t } = useTranslation();

  // tree + setTree are here in the container because child route drawers need to call to setTree after save to update the dnd list. This could instead be implemented as a useEffect in List, but it made more sense to me to call it in the onSuccess callback in the forms.
  const [tocAsDndTree, setTree] = useState(
    formatTreeData(text.attributes?.toc)
  );

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
      childProps: {
        setTree,
        textId: text.id,
        sections: text.attributes?.sectionsMap,
        toc: text.attributes?.toc
      }
    });
  };

  return text ? (
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
            to={lh.link("backendTextTOCEntryNew", text.id)}
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
            to={lh.link("backendTextTOC", text.id)}
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
        <TOCList
          toc={text.attributes?.toc}
          tree={tocAsDndTree}
          setTree={setTree}
          textId={text.id}
          startSectionId={text.attributes?.startTextSectionId}
        />
      </FormContainer.Form>
    </section>
  ) : null;
}

TextTOCContainer.displayName = "Text.Sections";

TextTOCContainer.propTypes = {
  text: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};
