import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notificationPreferencesAPI } from "api";
import { useApiCallback } from "hooks";
import lh from "helpers/linkHandler";

export default function UnsubscribeContainer() {
  const navigate = useNavigate();
  const { token } = useParams();

  const unsubscribe = useApiCallback(notificationPreferencesAPI.unsubscribe);

  useEffect(() => {
    if (token) {
      unsubscribe(token);
    }
    navigate(lh.link("frontend"));
  }, [navigate, token, unsubscribe]);

  return null;
}
