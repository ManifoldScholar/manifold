import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";
import { useTranslation } from "react-i18next";
import throttle from "lodash/throttle";

export default function Log({ log, onReset, canReset }) {
  const { t } = useTranslation();

  const logRef = useRef(null);

  useEffect(() => {
    const toBottom = throttle(() => {
      if (!logRef.current) return;
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }, 250);

    toBottom();
  }, [log, logRef]);

  return (
    <>
      <div className="ingestion-output__log">
        <p className="ingestion-output__label">
          {t("texts.ingestion.log_label")}
        </p>
        <div className="ingestion-output__log-value" ref={logRef}>
          {log.trim()}
        </div>
      </div>
      <div className="ingestion-output__utility">
        <button
          className="utility-button"
          onClick={onReset}
          disabled={!canReset}
        >
          <Utility.IconComposer
            icon="reload32"
            size={24}
            className="utility-button__icon utility-button__icon--highlight"
          />
          <span className="utility-button__text">
            {t("texts.ingestion.restart_button_label")}
          </span>
        </button>
      </div>
    </>
  );
}

Log.displayName = "Ingestion.Log";

Log.propTypes = {
  log: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
  canReset: PropTypes.bool.isRequired
};
