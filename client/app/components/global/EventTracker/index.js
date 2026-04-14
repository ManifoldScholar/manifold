import { useContext, useEffect, useRef } from "react";
import { ManifoldAnalyticsContext } from "helpers/contexts";

export const EVENTS = {
  VIEW_RESOURCE: "view resource",
  VIEW_LIBRARY: "view library"
};

export default function EventTracker({ event, resource }) {
  const { track } = useContext(ManifoldAnalyticsContext);
  const didTrackRef = useRef(false);

  // useEffect(() => {
  //   didTrackRef.current = false;
  //   const resourceType = resource?.type ?? null;
  //   const resourceId = resource?.id ?? null;
  //   if (!resourceType || !resourceId) return;
  //
  //   // Defer tracking past StrictMode's synchronous unmount/remount cycle
  //   const timer = setTimeout(() => {
  //     didTrackRef.current = true;
  //     track({ resourceType, resourceId, event });
  //   }, 0);
  //
  //   return () => {
  //     clearTimeout(timer);
  //     if (didTrackRef.current) {
  //       track({ resourceType, resourceId, event: "leave" });
  //     }
  //   };
  // }, [event, resource?.type, resource?.id, track]);

  return null;
}
