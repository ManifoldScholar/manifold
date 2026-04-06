import React from "react";
import PropTypes from "prop-types";
import serialize from "serialize-javascript";
import reduceAssets from "./reduceAssets";

function getJavascripts(stats) {
  const scripts = reduceAssets(".js", stats);
  return scripts.map(script => {
    return <script src={`/${script}`} key={script} />;
  });
}

function HtmlBody({ stats, content, bodyClass, store, disableBrowserRender }) {
  const contentProps = {};
  if (content) {
    contentProps.dangerouslySetInnerHTML = { __html: content };
    contentProps["data-ssr-render"] = true;
  }
  const javascripts = getJavascripts(stats);

  return (
    <body className={bodyClass}>
      <div id="content" {...contentProps} />
      {store && disableBrowserRender ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.DISABLE_BROWSER_RENDER=true`
          }}
        />
      ) : null}
      {store && !disableBrowserRender ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__=${serialize(store.getState())};`
          }}
        />
      ) : null}
      {javascripts}
    </body>
  );
}

HtmlBody.propTypes = {
  stats: PropTypes.object,
  content: PropTypes.string,
  bodyClass: PropTypes.string,
  store: PropTypes.object,
  disableBrowserRender: PropTypes.bool
};

export default HtmlBody;
