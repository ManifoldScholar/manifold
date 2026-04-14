import { useId, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import Form from "components/global/form";
import FormContainer from "components/global/form/Container";
import Dialog from "components/global/dialog";
import { useConfirmation } from "hooks";
import * as Styled from "../SortableCategories/parts/styles";

function NewCategory({ onError, onClose, isMarkdown, count = 0 }) {
  const { t } = useTranslation();
  const baseId = useId();
  const dialogLabelId = useId();
  const [isDirty, setIsDirty] = useState(false);
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();

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

  useEffect(() => {
    if (fetcher.data?.success) {
      onClose();
    }
    if (fetcher.data?.errors) {
      onError(fetcher.data.errors);
    }
  }, [fetcher.data]); // eslint-disable-line react-hooks/exhaustive-deps

  const confirmClose = () => {
    if (isDirty) {
      const heading = t("messages.confirm");
      const message = t("messages.unsaved_changes");
      confirm({ heading, message, callback: onClose });
    } else {
      onClose();
    }
  };

  const onDirty = session => {
    const dirtyAttrs = Object.keys(session.attributes).length;
    const dirtyRels = Object.keys(session.relationships).length;
    setIsDirty(!!(dirtyAttrs || dirtyRels));
  };

  const formatData = useCallback(
    dirty => {
      const data = {
        intent: "create-category",
        attributes: { ...dirty.attributes }
      };
      if (isMarkdown) {
        data.attributes.markdownOnly = true;
        if (!data.attributes.title) {
          data.attributes.title = `markdown_${baseId}-${count}`;
        }
      }
      return data;
    },
    [isMarkdown, baseId, count]
  );

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Styled.EditDialog
        as={Dialog.Wrapper}
        labelledBy={dialogLabelId}
        closeCallback={confirmClose}
        $isMarkdown={isMarkdown}
      >
        <h2 id={dialogLabelId}>{title}</h2>
        <FormContainer.Form
          fetcher={fetcher}
          formatData={formatData}
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
    </>
  );
}

NewCategory.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.New";

NewCategory.propTypes = {
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  count: PropTypes.number
};

export default NewCategory;
