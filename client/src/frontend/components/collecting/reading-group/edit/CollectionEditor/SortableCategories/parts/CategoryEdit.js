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

  const isMarkdown = category.attributes?.markdownOnly;

  const nameLabel = isMarkdown ? t("common.title") : t("forms.category.name");
  const descriptionLabel = isMarkdown
    ? t("common.content")
    : t("forms.category.description");
  const descriptionPlaceholder = isMarkdown
    ? t("forms.category.markdown_body_placeholder")
    : t("forms.category.description_placeholder");
  const descriptionInstructions = isMarkdown
    ? undefined
    : t("forms.category.description_instructions");

  return (
    <FormContainer.Form
      model={category}
      name={`${requests.feReadingGroupCategoryUpdate}-${category.attributes.slug}`}
      update={doUpdate}
      onSuccess={onSuccess}
      className="form-secondary"
    >
      <Form.FieldGroup>
        {!isMarkdown && (
          <Form.TextInput
            wide
            label={nameLabel}
            name="attributes[title]"
            placeholder={t("forms.category.name_placeholder")}
          />
        )}
        <Form.TextArea
          wide
          height={122}
          label={descriptionLabel}
          name="attributes[description]"
          placeholder={descriptionPlaceholder}
          instructions={descriptionInstructions}
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
