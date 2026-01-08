import { useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import useDialog from "@castiron/hooks/useDialog";
import Modal from "./Modal";
import * as Styled from "../styles";

export default function FlagModalToggle({ record }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const dialog = useDialog({ modal: true, scrollLockClassName: "no-scroll" });

  const handleUnflag = () => {
    fetcher.submit(
      JSON.stringify({
        intent: "unflag",
        type: record.type,
        id: record.id
      }),
      {
        method: "post",
        action: "/actions/flag-content",
        encType: "application/json"
      }
    );
  };

  const dialogId = useId();

  return (
    <>
      {record?.attributes?.flagged ? (
        <Styled.SecondaryButton
          onClick={handleUnflag}
          disabled={fetcher.state === "submitting"}
        >
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
        type={record.type}
        dialog={dialog}
        dialogId={dialogId}
      />
    </>
  );
}

FlagModalToggle.displayName = "Annotation.Annotation.UserContent.FlagToggle";

FlagModalToggle.propTypes = {
  record: PropTypes.object.isRequired
};
