import { createAction } from "redux-actions";
import { getUrl, openPopup } from "utils/oauth";

export const oauthStart = createAction("OAUTH_START", popup => ({ popup }));

export const oauthResponse = createAction("OAUTH_RESPONSE", event => ({
  event
}));

export const fail = createAction("OAUTH_FAILURE", errors => ({ errors }));

export const cancel = createAction("OAUTH_CANCEL");

export const prompt = provider => dispatch => {
  const url = getUrl(provider);
  const popup = openPopup(provider, url, "oauth2");

  dispatch(oauthStart(popup));
};
