import { useId, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Dialog from "global/components/dialog";
import { readingGroupsAPI, requests } from "api";
import withConfirmation from "hoc/withConfirmation";
import { MD_TITLE_REGEX } from "../../helpers/constants";
import * as Styled from "./styles";

function CategoryEdit({ category, groupId, onError, onClose, confirm, index }) {
  const { t } = useTranslation();

  const baseId = useId();

  const isMarkdown = category?.attributes?.markdownOnly;

  function doUpdate(categoryId, data) {
    if (isMarkdown && data.attributes.title === "")
      /* eslint-disable-next-line no-param-reassign */
      data.attributes.title = `markdown_${baseId}-${index}`;
    return readingGroupsAPI.updateCategory(groupId, categoryId, data);
  }

  const nameLabel = isMarkdown
    ? t("forms.category.title")
    : t("forms.category.name");
  const namePlaceholder = isMarkdown
    ? t("forms.category.title_placeholder")
    : t("forms.category.name_placeholder");
  const descriptionLabel = isMarkdown
    ? t("forms.category.block_content")
    : t("forms.category.description");
  const descriptionPlaceholder = isMarkdown
    ? t("forms.category.markdown_body_placeholder")
    : t("forms.category.description_placeholder");
  const descriptionInstructions = isMarkdown
    ? undefined
    : t("forms.category.description_instructions");

  const dialogLabelId = useId();

  const [isDirty, setIsDirty] = useState(false);

  const confirmClose = () => {
    if (isDirty) {
      const heading = t("messages.confirm");
      const message = t("messages.unsaved_changes");
      return confirm(heading, message, onClose);
    } else {
      onClose();
    }
  };

  const onDirty = session => {
    const dirtyAttrs = Object.keys(session.attributes).length;
    const dirtyRels = Object.keys(session.relationships).length;
    setIsDirty(!!(dirtyAttrs || dirtyRels));
  };

  return (
    <Styled.EditDialog
      as={Dialog.Wrapper}
      labelledBy={dialogLabelId}
      closeCallback={confirmClose}
      $isMarkdown={isMarkdown}
    >
      <h2 id={dialogLabelId}>
        {t("forms.category.edit_dialog_title", {
          title: isMarkdown ? "Markdown Block" : category.attributes.title
        })}
      </h2>
      <FormContainer.Form
        model={category}
        name={`${requests.feReadingGroupCategoryUpdate}-${category?.attributes?.slug}`}
        update={doUpdate}
        onSuccess={onClose}
        onError={onError}
        onDirty={onDirty}
        className="form-secondary"
      >
        <Form.FieldGroup>
          <Form.TextInput
            wide
            label={nameLabel}
            name="attributes[title]"
            placeholder={namePlaceholder}
            hideValue={val => MD_TITLE_REGEX.test(val)}
          />
          <Form.TextArea
            wide
            height={150}
            label={descriptionLabel}
            name="attributes[description]"
            placeholder={descriptionPlaceholder}
            instructions={descriptionInstructions}
          />
        </Form.FieldGroup>
        <Form.Save text="Save" theme="frontend" cancelCallback={confirmClose} />
      </FormContainer.Form>
    </Styled.EditDialog>
  );
}

CategoryEdit.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Edit";

CategoryEdit.propTypes = {
  category: PropTypes.object.isRequired,
  groupId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};

export default withConfirmation(CategoryEdit);
