import { useId, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useFetcher } from "react-router";
import { useTranslation } from "react-i18next";
import Form from "components/global/form";
import FormContainer from "global/containers/form";
import Dialog from "components/global/dialog";
import { useConfirmation } from "hooks";
import { MD_TITLE_REGEX } from "../../helpers/constants";
import * as Styled from "./styles";

function CategoryEdit({ category, onError, onClose, index }) {
  const { t } = useTranslation();
  const baseId = useId();
  const dialogLabelId = useId();
  const [isDirty, setIsDirty] = useState(false);
  const fetcher = useFetcher();
  const { confirm, confirmation } = useConfirmation();

  const isMarkdown = category?.attributes?.markdownOnly;

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
    (dirty, source) => {
      const attributes = { ...source.attributes, ...dirty.attributes };
      if (isMarkdown && attributes.title === "") {
        attributes.title = `markdown_${baseId}-${index}`;
      }
      return {
        intent: "update-category",
        categoryId: category.id,
        attributes
      };
    },
    [isMarkdown, baseId, index, category.id]
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
        <h2 id={dialogLabelId}>
          {t("forms.category.edit_dialog_title", {
            title: isMarkdown ? "Markdown Block" : category.attributes.title
          })}
        </h2>
        <FormContainer.Form
          model={category}
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
          <Form.Save
            text="Save"
            theme="frontend"
            cancelCallback={confirmClose}
          />
        </FormContainer.Form>
      </Styled.EditDialog>
    </>
  );
}

CategoryEdit.displayName =
  "ReadingGroup.Collecting.CollectionEditor.Category.Edit";

CategoryEdit.propTypes = {
  category: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired
};

export default CategoryEdit;
