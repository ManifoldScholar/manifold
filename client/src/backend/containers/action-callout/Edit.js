import { useEffect, useRef } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { actionCalloutsAPI, requests } from "api";
import { useFetch } from "hooks";
import Form from "./Form";

export default function CallToActionEdit() {
  const outletContext = useOutletContext() || {};
  const { refreshActionCallouts, calloutable, closeRoute } = outletContext;
  const { calloutId } = useParams();
  const prevIdRef = useRef(calloutId);

  const { data: actionCallout } = useFetch({
    request: [actionCalloutsAPI.show, calloutId],
    options: { requestKey: requests.beActionCallout },
    condition: !!calloutId
  });

  useEffect(() => {
    if (calloutId && prevIdRef.current && calloutId !== prevIdRef.current) {
      prevIdRef.current = calloutId;
    }
  }, [calloutId]);

  if (!actionCallout) return null;

  return (
    <Form
      refreshActionCallouts={refreshActionCallouts}
      actionCallout={actionCallout}
      closeRoute={closeRoute}
      calloutable={calloutable}
    />
  );
}

CallToActionEdit.displayName = "CallToAction.Edit";
