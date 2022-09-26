import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { readingGroupsAPI, requests } from "api";

function CategoryEdit({ category, groupId, onSuccess, onCancel }) {
  const { t } = useTranslation();

  function doUpdate(categoryId, data) {
    return readingGroupsAPI.updateCategory(groupId, categoryId, data);
  }

  return (
    <FormContainer.Form
      model={category}
      name={`${requests.feReadingGroupCategoryUpdate}-${category.attributes.slug}`}
      update={doUpdate}
      onSuccess={onSuccess}
      className="form-secondary"
    >
      <Form.FieldGroup>
        <Form.TextInput
          wide
          label={t("forms.category.name")}
          name="attributes[title]"
          placeholder={t("forms.category.name_placeholder")}
        />
        <Form.TextArea
          wide
          height={122}
          label={t("forms.category.description")}
          name="attributes[description]"
          placeholder={t("forms.category.description_placeholder")}
          instructions={t("forms.category.description_instructions")}
        />
      </Form.FieldGroup>
      <Form.Save text="Save" theme="frontend" cancelCallback={onCancel} />
    </FormContainer.Form>
  );
}

CategoryEdit.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Edit";

CategoryEdit.propTypes = {
  category: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default CategoryEdit;
