import dataLoader from "helpers/router/loaders/dataLoader";
import { settingsAPI, requests } from "api";

export default async function loader({ context }) {
  // Ensure settings are loaded (they're usually loaded in bootstrap, but this ensures they're available)
  const { requestKey } = await dataLoader({
    request: [settingsAPI.show],
    context,
    requestKey: requests.settings
  });

  return { requestKey };
}
