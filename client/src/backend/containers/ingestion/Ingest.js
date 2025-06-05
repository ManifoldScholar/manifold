import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Prompt, useParams } from "react-router-dom";
import Heading from "./Heading";
import Actions from "./Actions";
import Log from "./Log";
import { useFetch, useApiCallback, useNotification } from "hooks";
import { ingestionsAPI } from "api";
import useFetchIngestionMessages from "./useFetchIngestionMessages";

export default function IngestContainer({ sectionIngest, refresh }) {
  const { ingestionId } = useParams();
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      if (refresh) refresh();
    };
  }, [refresh]);

  const [action, setAction] = useState(null);

  const { data: ingestion } = useFetch({
    request: [ingestionsAPI.show, ingestionId],
    dependencies: [action]
  });

  const [log, setLog] = useState("Ready to ingest...");

  const { loading, startPolling } = useFetchIngestionMessages(
    ingestionId,
    setLog,
    setAction
  );

  const doProcess = useApiCallback(ingestionsAPI.process);
  const doReset = useApiCallback(ingestionsAPI.reset);

  const setErrorNotification = useNotification(message => ({
    level: 0,
    id: `INGESTION_ERROR`,
    heading: t("texts.ingestion.error.heading"),
    body: message,
    expiration: 0,
    scope: ingestion.attributes.state !== "sleeping" ? "global" : "drawer"
  }));

  const onReset = async () => {
    if (loading) return;

    const { errors } = await doReset(ingestionId);

    if (!errors) {
      setLog("Ready to ingest...");
    } else {
      setErrorNotification(errors);
    }
  };

  const onStart = async () => {
    if (loading) return;

    const { errors } = await doProcess(ingestionId);

    if (!errors) {
      setLog(log.concat("\n").concat("Starting ingestion..."));
      startPolling();
    } else {
      setErrorNotification(errors);
    }
  };

  if (!ingestion) return null;

  const {
    attributes: { state, availableEvents }
  } = ingestion;

  return (
    <>
      <Prompt message={t("messages.unsaved_changes")} when={loading} />
      <div className="ingestion-output">
        <Heading
          ingestion={ingestion}
          reingestion={state !== "sleeping"}
          sectionIngest={sectionIngest}
          loading={loading}
        />
        <Actions
          ingestion={ingestion}
          onStart={onStart}
          isSection={!!sectionIngest}
        />
        <Log
          log={log}
          onReset={onReset}
          canReset={!loading && availableEvents.includes("reset")}
        />
      </div>
    </>
  );
}

IngestContainer.displayName = "Ingestion.Container";

IngestContainer.propTypes = {
  text: PropTypes.object,
  sectionIngestion: PropTypes.bool,
  refresh: PropTypes.func
};
