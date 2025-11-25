import { useState, useCallback, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Unwrapped } from "global/components/form";
import { FormContext } from "helpers/contexts";
import { useApiCallback, useFromStore } from "hooks";
import { annotationsAPI, commentsAPI } from "api";
import NativeDialog from "global/components/NativeDialog";
import Button from "global/components/atomic/Button";
import * as Styled from "./styles";

export default function FlagAnnotationModal({
  id,
  annotationId,
  type,
  dialog
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

  const colorScheme = useFromStore({
    path: "ui.persistent.reader.colors.colorScheme"
  });
  const styleType = colorScheme === "dark" ? "secondary" : "primary";

  const heading = t("reader.report_annotation.header", {
    type:
      type === "annotations"
        ? t("glossary.annotation_title_case_one")
        : t("glossary.comment_title_case_one")
  });

  return (
    <NativeDialog title={heading} size="sm" {...dialog}>
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
            <Button
              type="submit"
              onClick={handleSubmit}
              label={t("actions.report")}
              size="lg"
              background="outline-red"
              preIcon="checkmark16"
              iconSize="intrinsic"
            />
            <Button
              type="button"
              onClick={dialog.onCloseClick}
              label={t("actions.cancel")}
              size="lg"
              background="outline"
              preIcon="close16"
              iconSize="intrinsic"
            />
          </Styled.ButtonGroup>
        </Styled.Form>
      </FormContext.Provider>
    </NativeDialog>
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
