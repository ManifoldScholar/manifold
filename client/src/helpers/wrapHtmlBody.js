import get from "lodash/get";
import reduceAssets from "./reduceAssets";

function getSettings(store) {
  if (!store) return null;
  const state = store.getState();
  if (!state) return null;
  return get(state, "entityStore.entities.settings.0");
}

function getFaviconLinks(store) {
  const settings = getSettings(store);
  const favicons = get(settings, "attributes.faviconStyles");
  if (!favicons || !favicons.original) {
    return `<link rel="shortcut icon" href="/static/favicon.ico?client=true" />`;
  }
  return `
    <link
      rel="shortcut icon"
      type="image/png"
      sizes="16x16"
      href=${favicons.small}
    />
    <link
      rel="shortcut icon"
      type="image/png"
      sizes="32x32"
      href=${favicons.medium}
    />
    <link
      rel="shortcut icon"
      type="image/png"
      sizes="96x96"
      href=${favicons.large}
    />
  `;
}

function getStylesheetLinks(stats) {
  const stylesheets = reduceAssets(".css", stats);
  if (!stylesheets?.length) return "";
  return stylesheets.map(stylesheet => {
    const media = stylesheet.includes("print") ? "print" : "screen, projection";
    return `
      <link
        href=${`/${stylesheet}`}
        rel="stylesheet"
        media=${media}
        type="text/css"
        charset="UTF-8"
      />`;
  });
}

export default function wrapHtmlBody({
  helmetContext = {},
  store,
  stats,
  styleTags = "",
  body = ""
}) {
  const favicons = getFaviconLinks(store);
  const stylesheets = getStylesheetLinks(stats);

  return `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="UTF-8">
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0"
        />
        <script src="/browser.config.js" charset="UTF-8"></script>
        ${favicons}
        ${stylesheets}
        ${styleTags}
        ${
          helmetContext?.helmet
            ? `
              ${helmetContext.helmet.title.toString()}
              ${helmetContext.helmet.meta.toString()}
              ${helmetContext.helmet.style.toString()}
            `
            : ""
        }
      </head>
      ${body}
    </html>
  `;
}
