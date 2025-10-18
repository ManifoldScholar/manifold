import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useApiCallback } from "hooks";
import useDialog from "@castiron/hooks/useDialog";
import { annotationsAPI, commentsAPI } from "api";
import Modal from "./Modal";
import * as Styled from "../styles";
import { useUID } from "react-uid";

export default function FlagModalToggle({ record, annotationId }) {
  const { t } = useTranslation();

  const dialog = useDialog({ modal: true, scrollLockClassName: "no-scroll" });

  const unflagAnnotation = useApiCallback(annotationsAPI.unflag);
  const unflagComment = useApiCallback(commentsAPI.unflag);

  const handleUnflag =
    record.type === "annotations" ? unflagAnnotation : unflagComment;

  const uid = useUID();

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
          aria-controls={uid}
        >
          {t("actions.report")}
        </Styled.SecondaryButton>
      )}
      <Modal
        id={record.id}
        modalId={uid}
        annotationId={annotationId}
        type={record.type}
        dialog={dialog}
      />
    </>
  );
}

FlagModalToggle.displayName = "Annotation.Annotation.UserContent.FlagToggle";

FlagModalToggle.propTypes = {
  record: PropTypes.object.isRequired,
  annotationId: PropTypes.string
};
