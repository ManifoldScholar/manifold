/* eslint-disable no-console */
import get from "lodash/get";
import { camelize } from "utils/humps";

export { default as openPopup } from "./popup";

export function providerSlug(provider) {
  switch (provider) {
    case "google":
      return "google_oauth2";
    default:
      return provider;
  }
}

/**
 * Get the name of the provider key in settings.
 *
 * @param {String} provider
 * @return {String}
 */
export function providerSetting(provider) {
  return camelize(providerSlug(provider));
}

/**
 * @param {String} provider
 * @return {String}
 */
export function getUrl(provider) {
  return `${import.meta.env.VITE_API_URL}/auth/${providerSlug(provider)}`;
}

/**
 * @param {MessageEvent} event
 * @return {Boolean}
 */
export function isOauthEvent(event) {
  if (get(event, "data.type") === "oauth") {
    const allowed = [
      import.meta.env.VITE_API_URL,
      import.meta.env.VITE_CLIENT_URL
    ];
    if (!allowed.includes(get(event, "origin"))) {
      console.error("Origin mismatch, %s is not API", event.origin);
      return false;
    }

    return true;
  }

  return false;
}
