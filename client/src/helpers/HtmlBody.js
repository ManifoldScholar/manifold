import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom/server";
import serialize from "serialize-javascript";
import BodyClass from "hoc/BodyClass";
import reduceAssets from "./reduceAssets";

function getJavascripts(stats) {
  const scripts = reduceAssets(".js", stats);
  return scripts.map(script => {
    return <script src={`/${script}`} key={script} charSet="UTF-8" />;
  });
}

function HtmlBody({ stats, component, store, disableBrowserRender }) {
  const content = component ? ReactDOM.renderToString(component) : null;
  const bodyClasses = BodyClass.rewind() || [];
  const bodyClass = bodyClasses.filter(Boolean).join(" ");
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
          charSet="UTF-8"
        />
      ) : null}
      {store && !disableBrowserRender ? (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_STATE__=${serialize(store.getState())};`
          }}
          charSet="UTF-8"
        />
      ) : null}
      {javascripts}
    </body>
  );
}

HtmlBody.propTypes = {
  stats: PropTypes.object,
  component: PropTypes.node,
  store: PropTypes.object,
  disableBrowserRender: PropTypes.bool
};

export default HtmlBody;
