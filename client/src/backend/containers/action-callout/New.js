import { useState } from "react";
import { useOutletContext, useLocation } from "react-router-dom";
import Form from "./Form";

export default function CallToActionNew() {
  const outletContext = useOutletContext() || {};
  const { refreshActionCallouts, calloutable, closeRoute } = outletContext;
  const location = useLocation();

  const [attributes] = useState(() => {
    const defaultAttributes = {
      kind: "link",
      location: "left",
      position: "top",
      button: true
    };

    if (location.state?.actionCallout) {
      return Object.assign(
        defaultAttributes,
        location.state.actionCallout.attributes
      );
    }

    return defaultAttributes;
  });

  const actionCallout = { attributes };

  return (
    <Form
      refreshActionCallouts={refreshActionCallouts}
      actionCallout={actionCallout}
      closeRoute={closeRoute}
      calloutable={calloutable}
    />
  );
}

CallToActionNew.displayName = "CallToAction.New";
