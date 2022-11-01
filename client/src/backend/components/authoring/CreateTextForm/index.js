import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import { useHistory } from "react-router";
import SectionsList from "./SectionsList";

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

  const [sectionName, setSectionName] = useState();
  const [sections, setSections] = useState([]);
  const setSectionOrder = result => {
    const { draggableId, destination } = result ?? {};
    const newOrder = sections.filter(s => s !== draggableId);
    newOrder.splice(destination.index, 0, draggableId);
    setSections(newOrder);
  };
  const handleDeleteSection = section => {
    const update = sections.filter(s => s !== section);
    setSections(update);
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
        <div>
          <Form.TextInput
            placeholder={t(
              "backend.forms.text_create.section_name_placeholder"
            )}
            onChange={e => setSectionName(e.target.value)}
            value={sectionName}
            buttons={[
              {
                label: t("actions.create"),
                onClick: (e, el) => {
                  setSections([...sections, el.value]);
                  setSectionName(null);
                }
              }
            ]}
          />
          <SectionsList
            sections={sections}
            setSectionOrder={setSectionOrder}
            onDelete={handleDeleteSection}
          />
        </div>
        <div className="buttons-icon-horizontal authoring-drawer">
          <button type="submit" className={buttonClasses} disabled={false}>
            <span>{t("backend.forms.text_create.save_button_label")}</span>
          </button>
          <button
            onClick={handleCancelClick}
            className={classNames(buttonClasses, "button-secondary--dull")}
          >
            <span>{t("actions.cancel")}</span>
          </button>
        </div>
      </Form.FieldGroup>
    </FormContainer.Form>
  );
}
