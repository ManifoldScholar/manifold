import { useCallback } from "react";
import useAnalyticsContext from "hooks/useAnalyticsContext";

export default function useEventTracker() {
  const context = useAnalyticsContext();

  const trackEvent = useCallback(
    (event, resourceType = null, resourceId = null) => {
      context.track({
        event,
        resourceType,
        resourceId
      });
    },
    [JSON.stringify(context)] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return trackEvent;
}
