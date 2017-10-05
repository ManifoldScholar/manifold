/* eslint-disable no-console */
import { get } from "lodash";
import { camelize } from "humps";
import config from "../../config";

export openPopup from "./popup";

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
  return `${config.apiUrl}/auth/${providerSlug(provider)}`;
}

/**
 * @param {MessageEvent} event
 * @return {Boolean}
 */
export function isOauthEvent(event) {
  if (get(event, "data.type") === "oauth") {
    const allowed = [`http://${config.domain}`, `https://${config.domain}`];
    if (!allowed.includes(get(event, "origin"))) {
      console.error("Origin mismatch, %s is not API", event.origin);
      return false;
    }

    return true;
  }

  return false;
}
