import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isBoolean from "lodash/isBoolean";

function toBoolean(value) {
  if (isBoolean(value)) return value;
  if (!value) return false;
  if (isString(value) && value.toLowerCase() === "true") return true;
  const number = parseInt(value, 10);
  return isNumber(number) && number > 0;
}

const isServer = typeof __SERVER__ === "undefined" || __SERVER__;
const isBrowser = !isServer;
const secure = toBoolean(process.env.SSL_ENABLED);
const port = parseInt(process.env.CLIENT_SERVER_PORT, 10);
const domain = process.env.DOMAIN;

const browserApiUrl =
  process.env.CLIENT_BROWSER_API_URL ||
  `${secure ? "https" : "http"}://${domain}`;
const serverApiUrl =
  process.env.CLIENT_SERVER_API_URL ||
  `${secure ? "https" : "http"}://${domain}`;
const browserCableUrl =
  process.env.CLIENT_BROWSER_API_CABLE_URL ||
  `${secure ? "wss" : "ws"}://${domain}/cable`;
const url =
  process.env.CLIENT_URL || secure ? `https://${domain}` : `http://${domain}`;

const serviceConfig = {
  api: isBrowser ? browserApiUrl : serverApiUrl,
  cable: browserCableUrl,
  client: {
    domain,
    url
  }
};

if (isServer) {
  serviceConfig.client = {
    ...serviceConfig.client,
    port,
    socket: process.env.CLIENT_SERVER_SOCKET,
    sparePort: port + 1,
    assetPort: port + 2,
    rescueEnabled: toBoolean(process.env.SSR_RESCUE),
    proxiesEnabled: toBoolean(process.env.CLIENT_SERVER_PROXIES)
  };
}

export default serviceConfig;
