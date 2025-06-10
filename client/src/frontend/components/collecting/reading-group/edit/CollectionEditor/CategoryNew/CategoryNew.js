import { useId, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useUIDSeed } from "react-uid";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Dialog from "global/components/dialog";
import { readingGroupsAPI, requests } from "api";
import withConfirmation from "hoc/withConfirmation";
import * as Styled from "../SortableCategories/parts/styles";

function NewCategory({
  groupId,
  onError,
  onClose,
  confirm,
  isMarkdown,
  count = 0,
  refresh
}) {
  const { t } = useTranslation();
  const seed = useUIDSeed();
  const dialogLabelId = useId();
  const [isDirty, setIsDirty] = useState(false);

  const title = isMarkdown
    ? t("forms.category.create_dialog_title_markdown")
    : t("forms.category.create_dialog_title");
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

  const doCreate = input => {
    const data = { ...input };
    if (isMarkdown) {
      data.attributes.markdownOnly = true;

      if (!data.attributes.title) {
        data.attributes.title = `markdown_${seed(count)}`;
      }
    }
    return readingGroupsAPI.createCategory(groupId, data);
  };

  const onSuccess = () => {
    onClose();
    refresh();
  };

  return (
    <Styled.EditDialog
      as={Dialog.Wrapper}
      labelledBy={dialogLabelId}
      closeCallback={confirmClose}
      $isMarkdown={isMarkdown}
    >
      <h2 id={dialogLabelId}>{title}</h2>
      <FormContainer.Form
        name={`${requests.feReadingGroupCategoryCreate}`}
        create={doCreate}
        onSuccess={onSuccess}
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
            required={!isMarkdown}
          />
          <Form.TextArea
            wide
            height={150}
            label={descriptionLabel}
            name="attributes[description]"
            placeholder={descriptionPlaceholder}
            instructions={descriptionInstructions}
            required={isMarkdown}
          />
        </Form.FieldGroup>
        <Form.Save
          text={t("actions.save")}
          theme="frontend"
          cancelCallback={confirmClose}
        />
      </FormContainer.Form>
    </Styled.EditDialog>
  );
}

NewCategory.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.New";

NewCategory.propTypes = {
  groupId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  count: PropTypes.number
};

export default withConfirmation(NewCategory);
