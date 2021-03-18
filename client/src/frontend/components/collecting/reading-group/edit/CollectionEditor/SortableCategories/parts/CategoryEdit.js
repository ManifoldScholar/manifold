import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import { readingGroupsAPI, requests } from "api";

function CategoryEdit({ category, groupId, onSuccess, onCancel }) {
  function doUpdate(categoryId, data) {
    return readingGroupsAPI.updateCategory(groupId, categoryId, data);
  }

  return (
    <FormContainer.Form
      model={category}
      name={requests.feReadingGroupCategoryUpdate}
      update={doUpdate}
      onSuccess={onSuccess}
      className="form-secondary"
    >
      <Form.TextInput
        wide
        label="Category Name"
        name="attributes[title]"
        placeholder="Enter Category Name"
      />
      <Form.TextArea
        wide
        height={122}
        label="Category Description"
        name="attributes[description]"
        placeholder="Enter Category Description"
        instructions="Enter a brief description of the category. This field accepts basic Markdown."
      />
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
