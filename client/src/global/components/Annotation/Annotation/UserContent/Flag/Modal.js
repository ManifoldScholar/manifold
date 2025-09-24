import { useState, useCallback, useId } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Unwrapped } from "global/components/form";
import IconComposer from "global/components/utility/IconComposer";
import { FormContext } from "helpers/contexts";
import { useApiCallback, useFromStore } from "hooks";
import { annotationsAPI, commentsAPI } from "api";
import Modal from "global/components/dialog/Modal";
import * as Styled from "./styles";

export default function FlagAnnotationModal({
  id,
  annotationId,
  type,
  dialog,
  dialogId
}) {
  const { t } = useTranslation();

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState([]);

  const messageId = useId();
  const errorId = `${messageId}-error`;

  const flagAnnotation = useApiCallback(annotationsAPI.flag);
  const flagComment = useApiCallback(commentsAPI.flag, {
    refreshes: `comments-for-${annotationId}`
  });

  const handleSubmit = useCallback(
    async e => {
      e.preventDefault();
      try {
        const handleFlag =
          type === "annotations" ? flagAnnotation : flagComment;
        const res = await handleFlag(id, message);
        if (res?.data) return dialog.onCloseClick();
      } catch (err) {
        setErrors(err);
      }
    },
    [id, type, message, flagAnnotation, flagComment, dialog]
  );

  const buttonClasses = classNames(
    "buttons-icon-horizontal__button",
    "buttons-icon-horizontal__button--in-dialog",
    "button-icon-secondary"
  );

  const colorScheme = useFromStore({
    path: "ui.persistent.reader.colors.colorScheme"
  });
  const styleType = colorScheme === "dark" ? "secondary" : "primary";

  return (
    <Modal id={dialogId} dialog={dialog} maxWidth={600}>
      <header className="dialog__header">
        <Styled.Heading>
          {t("reader.report_annotation.header", {
            type:
              type === "annotations"
                ? t("glossary.annotation_title_case_one")
                : t("glossary.comment_title_case_one")
          })}
        </Styled.Heading>
      </header>
      <p>{t("reader.report_annotation.instructions")}</p>
      <FormContext.Provider value={{ styleType }}>
        <Styled.Form className="dialog__body">
          <Unwrapped.TextArea
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
            id={messageId}
            placeholder={t("reader.report_annotation.placeholder")}
            aria-describedby={errorId}
            name="message"
            errors={errors}
            idForError={errorId}
            label={t("reader.report_annotation.message_input_label")}
          />
          <Styled.ButtonGroup>
            <button
              type="submit"
              className={classNames(
                buttonClasses,
                "button-icon-secondary--red"
              )}
              onClick={handleSubmit}
            >
              <IconComposer
                icon="checkmark16"
                size="default"
                className="button-icon-secondary__icon"
              />
              {t("actions.report")}
            </button>
            <button
              type="button"
              className={classNames(
                buttonClasses,
                "button-icon-secondary--dull"
              )}
              onClick={dialog.onCloseClick}
            >
              <IconComposer
                icon="close16"
                size="default"
                className="button-icon-secondary__icon"
              />
              {t("actions.cancel")}
            </button>
          </Styled.ButtonGroup>
        </Styled.Form>
      </FormContext.Provider>
    </Modal>
  );
}

FlagAnnotationModal.displayName = "Annotation.Annotation.UserContent.FlagModal";

FlagAnnotationModal.propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  dialogId: PropTypes.string.isRequired,
  dialog: PropTypes.object.isRequired,
  annotationId: PropTypes.string
};
