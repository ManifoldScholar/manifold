import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import SectionsList from "./SectionsList";
import { useUIDSeed } from "react-uid";

export default function CreateTextForm({ cancelUrl, project, onSuccess }) {
  const { t } = useTranslation();
  const uidSeed = useUIDSeed();

  const [sectionName, setSectionName] = useState();
  const [sections, setSections] = useState([]);
  const setSectionOrder = result => {
    const { draggableId, destination } = result ?? {};
    const entity = sections.find(s => s.id === draggableId);
    const newOrder = sections.filter(s => s.id !== draggableId);
    newOrder.splice(destination.index, 0, entity);
    setSections(newOrder);
  };
  const handleDeleteSection = section => {
    const update = sections.filter(s => s.id !== section.id);
    setSections(update);
  };

  return (
    <FormContainer.Form
      doNotWarn
      groupErrors
      model={project}
      name="tbd"
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
                  const duplicate = sections.filter(s => s.name === el.value);
                  const id = duplicate.length
                    ? `${el.value}_${duplicate.length}`
                    : el.value;
                  setSections([
                    ...sections,
                    { id: uidSeed(id), name: el.value }
                  ]);
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
        <Form.DrawerButtons
          showCancel
          cancelUrl={cancelUrl}
          submitLabel="backend.forms.text_create.save_button_label"
        />
      </Form.FieldGroup>
    </FormContainer.Form>
  );
}

CreateTextForm.displayName = "Project.Texts.CreateForm";

CreateTextForm.propTypes = {
  cancelUrl: PropTypes.string,
  project: PropTypes.object.isRequired,
  onSuccess: PropTypes.func
};
