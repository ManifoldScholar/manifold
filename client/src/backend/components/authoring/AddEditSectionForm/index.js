import React from "react";
import PropTypes from "prop-types";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useHistory } from "react-router-dom";
import lh from "helpers/linkHandler";

export default function AddEditSectionForm({ section = {}, text, onSuccess }) {
  const { t } = useTranslation();
  const history = useHistory();

  const buttonClasses = "button-secondary button-secondary--outlined";

  const handleCancelClick = e => {
    e.preventDefault();
    history.push(lh.link("backendTextSections", text.id));
  };

  const createSection = () => {};
  const editSection = () => {};

  return (
    <FormContainer.Form
      model={section}
      name="tbd"
      className="form-secondary"
      onSuccess={onSuccess}
      create={createSection}
      update={editSection}
    >
      <Form.TextInput
        focusOnMount
        label={t("backend.forms.text_section.section_name")}
        placeholder={t("backend.forms.text_section.section_name")}
      />
      <Form.CodeArea
        label={t("backend.forms.text_section.content_label")}
        instructions={t("backend.forms.text_section.content_instructions")}
        height="600px"
        mode="css"
      />
      <div className="buttons-icon-horizontal authoring-drawer">
        <button type="submit" className={buttonClasses} disabled={false}>
          <span>{t("backend.forms.text_section.save_button_label")}</span>
        </button>
        <button
          onClick={handleCancelClick}
          className={classNames(buttonClasses, "button-secondary--dull")}
        >
          <span>{t("actions.cancel")}</span>
        </button>
      </div>
    </FormContainer.Form>
  );
}

AddEditSectionForm.displayName = "Text.Sections.AddEditForm";

AddEditSectionForm.propTypes = {
  text: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
};
