import React from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";

export default function EditTOCEntryForm({ entry = {}, text, onSuccess }) {
  const { t } = useTranslation();

  const editEntry = () => {};

  return (
    <FormContainer.Form
      model={text}
      name="tbd"
      className="form-secondary"
      onSuccess={onSuccess}
      update={editEntry}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.forms.text_toc.entry_name")}
        placeholder={t("backend.forms.text_toc.entry_name")}
        value={entry?.name}
      />
      <Form.FieldGroup
        label={t("backend.forms.text_toc.section_link")}
        instructions={t("backend.forms.text_toc.section_link_instructions")}
      >
        <Form.Select
          options={[
            {
              value: "",
              label: t("backend.forms.text_toc.section_link_placeholder"),
              key: 0
            }
          ]}
          rounded
          wide
          hideLabel
        />
      </Form.FieldGroup>
      <Form.FieldGroup
        label={t("backend.forms.text_toc.anchor_link")}
        instructions={t("backend.forms.text_toc.anchor_link_instructions")}
      >
        <Form.TextInput placeholder="#" />
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={lh.link("backendTextTOC", text.id)}
        submitLabel="backend.forms.text_toc.save_button_label"
      />
    </FormContainer.Form>
  );
}

EditTOCEntryForm.displayName = "Text.TOC.EditEntryForm";

EditTOCEntryForm.propTypes = {
  text: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
};
