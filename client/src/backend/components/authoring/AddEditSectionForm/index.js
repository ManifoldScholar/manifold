import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { sectionsAPI } from "api";
import { useHistory } from "react-router-dom";
import {
  serializeToHtml,
  serializeToSlate
} from "global/components/form/RichText/serializers";

export default function AddEditSectionForm({
  section,
  textId,
  nextPosition,
  refresh
}) {
  const { t } = useTranslation();
  const history = useHistory();

  const defaultModel = {
    attributes: { position: nextPosition, kind: "section" }
  };

  const createSection = model => {
    return sectionsAPI.create(textId, model);
  };

  const formatData = (data, model) => {
    const { body, name } = data.attributes ?? {};
    const { position, kind } = model.attributes ?? {};
    if (!body || typeof body === "string")
      return {
        attributes: {
          position,
          kind,
          name,
          body: serializeToHtml(serializeToSlate(body))
        }
      };
    return {
      attributes: { position, kind, name, body: serializeToHtml(body) }
    };
  };

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendTextSections", textId));
  }, [history, textId, refresh]);

  const [hasErrors, setHasErrors] = useState(false);
  const [warnErrors, setWarnErrors] = useState(false);
  const errorProps = {
    hasErrors,
    setHasErrors,
    warnErrors,
    setWarnErrors
  };

  return (
    <FormContainer.Form
      model={section ?? defaultModel}
      name={section ? "be-text-section-update" : "be-text-section-create"}
      className="form-secondary"
      onSuccess={onSuccess}
      formatData={formatData}
      create={createSection}
      update={sectionsAPI.update}
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.section.section_name")}
        placeholder={t("texts.section.section_name")}
        name="attributes[name]"
      />
      <Form.RichText
        label={t("texts.section.content_label")}
        instructions={"Rich text section content"}
        name="attributes[body]"
        sectionId={section?.id}
        sectionBody={section?.attributes.body}
        stylesheets={section?.relationships.stylesheets}
        {...errorProps}
      />
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextSections", textId)}
        submitLabel="texts.section.save_button_label"
        disableSubmit={!!hasErrors}
      />
    </FormContainer.Form>
  );
}

AddEditSectionForm.displayName = "Text.Sections.AddEditForm";

AddEditSectionForm.propTypes = {
  textId: PropTypes.string.isRequired,
  section: PropTypes.object,
  refresh: PropTypes.func,
  nextPosition: PropTypes.number
};
