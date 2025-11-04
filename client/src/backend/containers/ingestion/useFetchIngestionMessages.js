import { useRef, useCallback, useEffect, useState } from "react";
import { useApiCallback } from "hooks";
import { ingestionsAPI } from "api";

export default function useFetchIngestionMessages(id, setLog, setAction) {
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const logIds = useRef([]);

  const startTime = useRef(null);

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

  const checkForEnd = useCallback(
    message => {
      if (message[1]?.includes("Complete")) {
        endPolling();
        setAction("end");
      }
    },
    [endPolling, setAction]
  );

  const processMessage = useCallback(
    message => {
      if (!message.id || !message.payload) return;
      if (logIds.current.includes(message.id)) return;

      logIds.current = [...logIds.current, message.id];

      if (message.kind === "log") {
        appendToLog(message.payload);
        checkForEnd(message.payload);
      }
    },
    [appendToLog, logIds, checkForEnd]
  );

  const fetchMessages = useApiCallback(ingestionsAPI.messages, {
    silent: true
  });

  const startPolling = useCallback(() => {
    if (intervalRef.current) return;

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
  }, [fetchMessages, processMessage, id]);

  useEffect(() => {
    return () => {
      endPolling();
    };
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  return { startPolling, loading };
}
