import { useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import useDialog from "@castiron/hooks/useDialog";
import { useApiCallback } from "hooks";
import { annotationsAPI, commentsAPI } from "api";
import Modal from "./Modal";
import * as Styled from "../styles";

export default function FlagModalToggle({ record, annotationId }) {
  const { t } = useTranslation();

  const dialog = useDialog({ modal: true, scrollLockClassName: "no-scroll" });

  const unflagAnnotation = useApiCallback(annotationsAPI.unflag);
  const unflagComment = useApiCallback(commentsAPI.unflag);

  const handleUnflag =
    record.type === "annotations" ? unflagAnnotation : unflagComment;

  const dialogId = useId();

  return (
    <>
      {record?.attributes?.flagged ? (
        <Styled.SecondaryButton onClick={() => handleUnflag(record.id)}>
          {t("actions.unflag")}
        </Styled.SecondaryButton>
      ) : (
        <Styled.SecondaryButton
          ref={dialog.toggleRef}
          onClick={dialog.onToggleClick}
          aria-controls={dialogId}
        >
          {t("actions.report")}
        </Styled.SecondaryButton>
      )}
      <Modal
        id={record.id}
        annotationId={annotationId}
        type={record.type}
        dialog={dialog}
        dialogId={dialogId}
      />
    </>
  );
}

FlagModalToggle.displayName = "Annotation.Annotation.UserContent.FlagToggle";

FlagModalToggle.propTypes = {
  record: PropTypes.object.isRequired,
  annotationId: PropTypes.string
};
