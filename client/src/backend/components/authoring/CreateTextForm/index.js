import React from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useHistory } from "react-router";

export default function CreateTextForm({
  name,
  cancelUrl,
  project,
  onSuccess
}) {
  const history = useHistory();
  const { t } = useTranslation();

  const buttonClasses = "button-secondary button-secondary--outlined";

  const handleCancelClick = e => {
    e.preventDefault();
    cancelUrl ? history.push(cancelUrl) : history.goBack();
  };

  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      model={"TBD"}
      name={name}
      className="form-secondary"
      onSuccess={onSuccess}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.forms.text_create.text_title")}
        placeholder={t("backend.forms.text_create.title_placeholder")}
      />
      <Form.FieldGroup
        label={t("backend.forms.text_create.cover_section_label")}
        instructions={t("backend.forms.text_create.cover_instructions")}
      >
        <Form.Upload accepts="images" />
      </Form.FieldGroup>
      <Form.FieldGroup
        label={t("backend.forms.text_create.sections_section_label")}
        instructions={t("backend.forms.text_create.sections_instructions")}
      >
        <Form.TextInput
          placeholder={t("backend.forms.text_create.section_name_placeholder")}
          buttons={[{ label: t("actions.create") }]}
        />
        <div className="buttons-icon-horizontal authoring-drawer">
          <button type="submit" className={buttonClasses} disabled={false}>
            <span>{t("backend.forms.text_create.save_button_label")}</span>
          </button>
          {cancelUrl ? (
            <button
              onClick={handleCancelClick}
              className={classNames(buttonClasses, "button-secondary--dull")}
            >
              <span>{t("actions.cancel")}</span>
            </button>
          ) : null}
        </div>
      </Form.FieldGroup>
    </FormContainer.Form>
  );
}
