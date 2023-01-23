import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function RouteAnnouncer({ title }) {
  const { pathname } = useLocation();
  const [content, setContent] = useState(null);

  useEffect(() => {
    setContent(title);
  }, [pathname, title]);

  return (
    <p
      aria-live="assertive" // Make the announcement immediately.
      id="route-announcer"
      role="alert"
      className="screen-reader-text"
    >
      {content}
    </p>
  );
}
