import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useRevalidator } from "react-router";
import NavigationBlocker from "global/components/router/NavigationBlocker";
import Heading from "./Heading";
import Actions from "./Actions";
import Log from "./Log";
import { useApiCallback, useNotifications } from "hooks";
import { ingestionsAPI } from "api";
import useFetchIngestionMessages from "./useFetchIngestionMessages";

export default function IngestContainer({ ingestion, section }) {
  const { ingestionId } = useParams();
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();

  const [log, setLog] = useState("Ready to ingest...");

  const { loading, startPolling } = useFetchIngestionMessages(
    ingestionId,
    setLog
  );

  const doProcess = useApiCallback(ingestionsAPI.process);
  const doReset = useApiCallback(ingestionsAPI.reset);

  const { addNotification } = useNotifications();

  const onReset = async () => {
    if (loading) return;

    const { errors } = await doReset(ingestionId);

    if (!errors) {
      setLog("Ready to ingest...");
      revalidate();
    } else {
      addNotification({
        level: 0,
        id: `INGESTION_ERROR`,
        heading: t("texts.ingestion.error.heading"),
        body: errors,
        expiration: 0,
        scope: ingestion.attributes.state !== "sleeping" ? "global" : "drawer"
      });
    }
  };

  const onStart = async () => {
    if (loading) return;

    const { errors } = await doProcess(ingestionId);

    if (!errors) {
      setLog(log.concat("\n").concat("Starting ingestion..."));
      startPolling();
    } else {
      addNotification({
        level: 0,
        id: `INGESTION_ERROR`,
        heading: t("texts.ingestion.error.heading"),
        body: errors,
        expiration: 0,
        scope: ingestion.attributes.state !== "sleeping" ? "global" : "drawer"
      });
    }
  };

  if (!ingestion) return null;

  const {
    attributes: { state, availableEvents }
  } = ingestion;

  return (
    <>
      <NavigationBlocker
        message={t("messages.unsaved_changes")}
        when={loading}
      />
      <div className="ingestion-output">
        <Heading
          ingestion={ingestion}
          reingestion={state !== "sleeping"}
          sectionIngest={section}
          loading={loading}
        />
        <Actions
          ingestion={ingestion}
          onStart={onStart}
          isSection={section}
          loading={loading}
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
