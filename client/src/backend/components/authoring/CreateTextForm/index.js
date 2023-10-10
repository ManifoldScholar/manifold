import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import FormContainer from "global/containers/form";
import Form from "global/components/form";
import SectionsList from "./SectionsList";
import { useUIDSeed } from "react-uid";
import { textsAPI } from "api";
import lh from "helpers/linkHandler";
import { useHistory } from "react-router-dom";

export default function CreateTextForm({ cancelUrl, projectId, refresh }) {
  const { t } = useTranslation();
  const uidSeed = useUIDSeed();
  const history = useHistory();

  const [sectionName, setSectionName] = useState();
  const [sections, setSections] = useState([]);

  const setSectionOrder = result => {
    const { draggableId, destination } = result ?? {};
    const entity = sections.find(s => s.id === draggableId);
    const newOrder = sections.filter(s => s.id !== draggableId);
    newOrder.splice(destination.index, 0, entity);
    setSections(newOrder);
  };

  const handleDeleteSection = id => {
    const update = sections.filter(s => s.id !== id);
    setSections(update);
  };

  const handleAddSection = (e, el) => {
    const duplicate = sections.filter(s => s.name === el.value);
    const id = duplicate.length ? `${el.value}_${duplicate.length}` : el.value;
    setSections([...sections, { id: uidSeed(id), name: el.value }]);
    setSectionName(null);
  };

  const addSectionsToRequest = data => {
    return {
      attributes: {
        sectionNames: sections.map(s => s.name),
        ...data.attributes
      }
    };
  };

  const createText = model => {
    return textsAPI.create(projectId, model);
  };

  const onSuccess = useCallback(() => {
    if (refresh) refresh();
    history.push(lh.link("backendProjectTexts", projectId));
  }, [history, projectId, refresh]);

  return (
    <FormContainer.Form
      create={createText}
      formatData={addSectionsToRequest}
      name="backend-text-create"
      className="form-secondary"
      onSuccess={onSuccess}
    >
      <Form.TextInput
        focusOnMount
        label={t("texts.create.text_title")}
        placeholder={t("texts.create.title_placeholder")}
        name="attributes[title]"
      />
      <Form.FieldGroup
        label={t("texts.create.cover_section_label")}
        instructions={t("hero.cover_image_instructions", {
          entity: t("glossary.text_one")
        })}
      >
        <Form.Upload
          layout="portrait"
          accepts="images"
          name="attributes[cover]"
          readFrom="attributes[coverStyles][small]"
          altTextName={"attributes[coverAltText]"}
          altTextLabel={t("hero.cover_image_alt_label")}
        />
      </Form.FieldGroup>
      <Form.FieldGroup
        label={t("texts.create.sections_section_label")}
        instructions={t("texts.create.sections_instructions")}
      >
        <div>
          <Form.TextInput
            placeholder={t("texts.create.section_name_placeholder")}
            onChange={e => {
              e.preventDefault();
              setSectionName(e.target.value);
            }}
            onKeyDown={(e, el) => {
              if (e.keyCode === 13) {
                e.preventDefault();
                handleAddSection(e, el);
              }
            }}
            value={sectionName}
            buttons={[
              {
                label: t("actions.create"),
                onClick: handleAddSection
              }
            ]}
          />
          <SectionsList
            sections={sections}
            setSectionOrder={setSectionOrder}
            onDelete={handleDeleteSection}
          />
        </div>
      </Form.FieldGroup>
      <Form.DrawerButtons
        showCancel
        cancelUrl={cancelUrl}
        submitLabel="texts.create.save_button_label"
      />
    </FormContainer.Form>
  );
}

CreateTextForm.displayName = "Project.Texts.CreateForm";

CreateTextForm.propTypes = {
  cancelUrl: PropTypes.string,
  projectId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};
