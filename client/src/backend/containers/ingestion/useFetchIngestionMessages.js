import { useRef, useCallback, useEffect, useState } from "react";
import { useApiCallback } from "hooks";
import { ingestionsAPI } from "api";

export default function useFetchIngestionMessages(
  id,
  setLog,
  setContainerFetch
) {
  const intervalRef = useRef(null);
  const ingestionIntervalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const logIds = useRef([]);

  const startTime = useRef(null);

  const endPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setLoading(false);
    logIds.current = [];
  }, [setLoading, logIds]);

  const appendToLog = useCallback(
    message => {
      if (message[0] === "DEBUG") return;
      setLog(log => log.concat("\n").concat(message[1]));
    },
    [setLog]
  );

  const processMessage = useCallback(
    message => {
      if (!message.id || !message.payload) return;
      if (logIds.current.includes(message.id)) return;

      logIds.current = [...logIds.current, message.id];

      if (message.kind === "log") {
        appendToLog(message.payload);
      }
    },
    [appendToLog, logIds]
  );

  const fetchMessages = useApiCallback(ingestionsAPI.messages, {
    silent: true
  });

  const fetchIngestion = useApiCallback(ingestionsAPI.show, { silent: true });

  const startPollingIngestion = useCallback(() => {
    if (ingestionIntervalRef.current) return;

    ingestionIntervalRef.current = setInterval(async () => {
      try {
        const { data: ingestion, errors } = await fetchIngestion(id);

        if (!errors) {
          const { state } = ingestion.attributes ?? {};
          if (state === "finished") {
            clearInterval(ingestionIntervalRef.current);
            ingestionIntervalRef.current = null;
            setContainerFetch(false);
            setTimeout(() => {
              endPolling();
            }, 8000);
          }
        }
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.debug(error);
      }
    }, 3000);
  }, [fetchIngestion, id, endPolling, setContainerFetch]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

    startPollingIngestion();

    setLoading(true);

    const now = new Date();
    now.setSeconds(now.getSeconds() - 5);
    startTime.current = now.toISOString();

    intervalRef.current = setInterval(async () => {
      try {
        const { data, errors } = await fetchMessages(id, startTime.current);

        if (!errors) {
          data.forEach(m => processMessage(m.attributes));
        }
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.debug(error);
      }
    }, 1000);
  }, [fetchMessages, processMessage, id, startPollingIngestion]);

  useEffect(() => {
    return () => {
      endPolling();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return { startPolling, loading };
}
