import { useRef, useCallback, useEffect, useState } from "react";
import { useApiCallback } from "hooks";
import { ingestionsAPI } from "api";

export default function useFetchIngestionMessages(id, setLog, setAction) {
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const logIds = useRef([]);

  const endPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setLoading(false);
      logIds.current = [];
    }
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
        return appendToLog(message.payload);
      }

      if (message.kind === "message") {
        if (message.payload === "END_ACTION") {
          endPolling();
          return setAction("end");
        }
        return setAction("start");
      }
    },
    [endPolling, appendToLog, setAction, logIds]
  );

  const fetchMessages = useApiCallback(ingestionsAPI.messages);

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;
    setLoading(true);
    intervalRef.current = setInterval(async () => {
      try {
        const time = new Date();
        time.setSeconds(time.getSeconds() - 5);
        const { data, errors } = await fetchMessages(id, time.toISOString());

        if (!errors) {
          data.forEach(m => processMessage(m.attributes));
        }
      } catch (error) {
        /* eslint-disable-next-line no-console */
        console.debug(error);
      }
    }, 1000);
  }, [fetchMessages, processMessage, id]);

  useEffect(() => {
    return () => {
      endPolling();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return { startPolling, loading };
}
