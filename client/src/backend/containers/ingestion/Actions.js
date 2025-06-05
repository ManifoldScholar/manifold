import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import IconComposer from "global/components/utility/IconComposer";
import lh from "helpers/linkHandler";

export default function IngestionActions({ onStart, ingestion, isSection }) {
  const { t } = useTranslation();
  const { id, ingestionId } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const startRef = useRef(null);

  useEffect(() => {
    if (startRef.current) startRef.current.focus();
  }, []);

  if (!ingestion) return null;

  const {
    attributes: { state }
  } = ingestion;

  const finished = state === "finished";
  const inProgress = state === "processing";

  const editUrl = () => {
    if (isSection) {
      return lh.link("backendTextSectionIngestNewEdit", id, ingestionId);
    }

    const path = pathname.includes("texts")
      ? "backendProjectTextsIngestionEdit"
      : "backendTextIngestionEdit";

    return lh.link(path, id, ingestionId);
  };

  const closeUrl = () => {
    if (isSection) return lh.link("backendTextSections", id);

    const path = pathname.includes("texts")
      ? "backendProjectTexts"
      : "backendTextIngestionsNew";

    return lh.link(path, id);
  };

  const onCancel = () => {
    navigate(editUrl(), { stage: "upload" });
  };

  const onComplete = () => {
    navigate(closeUrl());
  };

  const buttonClasses = classNames(
    "buttons-icon-horizontal__button",
    "button-icon-secondary"
  );

  const startLabel = inProgress
    ? t("texts.ingestion.ingesting_button_label")
    : t("texts.ingestion.start_button_label");

  return (
    <div className="ingestion-output__buttons buttons-icon-horizontal">
      {finished ? (
        <button onClick={onComplete} className={buttonClasses}>
          <IconComposer
            icon="checkmark16"
            size="default"
            className="button-icon-secondary__icon"
          />
          <span>{t("texts.ingestion.complete_button_label")}</span>
        </button>
      ) : (
        <>
          <button
            ref={startRef}
            onClick={onStart}
            className={buttonClasses}
            disabled={inProgress}
          >
            <IconComposer
              icon="arrowDown16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{startLabel}</span>
          </button>
          <button
            onClick={onCancel}
            className={classNames(buttonClasses, "button-icon-secondary--dull")}
            disabled={inProgress}
          >
            <IconComposer
              icon="close16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{t("texts.ingestion.change_button_label")}</span>
          </button>
        </>
      )}
    </div>
  );
}

IngestionActions.displayName = "Ingestion.Actions";

IngestionActions.propTypes = {
  ingestion: PropTypes.object,
  isSection: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired
};
