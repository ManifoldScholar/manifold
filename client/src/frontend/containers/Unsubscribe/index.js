import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom-v5-compat";
import { requests, notificationPreferencesAPI } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export default function UnsubscribeContainer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    if (token) {
      const action = notificationPreferencesAPI.unsubscribe(token);
      const unsubscribeRequest = request(action, requests.feUnsubscribe);
      dispatch(unsubscribeRequest);
    }

    const url = lh.link("frontend");
    navigate(url);
  }, [dispatch, navigate, token]);

  return null;
}
