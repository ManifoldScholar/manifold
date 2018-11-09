import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom/server";
import serialize from "serialize-javascript";
import Helmet from "react-helmet";
import { HigherOrder } from "components/global";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import endsWith from "lodash/endsWith";
import startsWith from "lodash/startsWith";
import get from "lodash/get";

/**
 * Wrapper component containing HTML metadata and boilerplate tags.
 * Used in server-side code only to wrap the string output of the
 * rendered route component.
 *
 * The only thing this component doesn't (and can't) include is the
 * HTML doctype declaration, which is added to the rendered output
 * by the server.js file.
 */
export default class Html extends Component {
  static propTypes = {
    stats: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object,
    disableClientSideRender: PropTypes.bool
  };

  get settings() {
    const state = this.props.store.getState();
    if (!state) return null;
    return get(state, "entityStore.entities.settings.0");
  }

  reduceAssets(ext) {
    const test = asset => {
      return endsWith(asset, ext);
    };

    const chunks = this.props.stats.assetsByChunkName;
    return reduce(
      chunks,
      (entries, assets, chunkName) => {
        if (!["build/theme", "build/client"].includes(chunkName))
          return entries;
        if (isString(assets) && test(assets)) entries.push(assets);
        if (isArray(assets)) {
          assets.forEach(asset => {
            if (test(asset)) entries.push(asset);
          });
        }
        return entries;
      },
      []
    );
  }

  stylesheets = () => {
    if (!this.props.stats && !this.props.stats.assetsByChunkName) return null;
    const stylesheets = this.reduceAssets(".css");
    return stylesheets.map(stylesheet => (
      <link
        href={`/${stylesheet}`}
        key={stylesheet}
        media="screen, projection"
        rel="stylesheet"
        type="text/css"
        charSet="UTF-8"
      />
    ));
  };

  javascripts = () => {
    if (!this.props.stats && !this.props.stats.assetsByChunkName) return null;
    const scripts = this.reduceAssets(".js");
    scripts.sort(a => {
      if (a === "build/theme.js") return -1;
      return 1;
    });

    return scripts.map(script => {
      if (
        this.props.disableClientSideRender &&
        startsWith(script, "build/client")
      ) {
        return "";
      }
      return <script src={`/${script}`} key={script} charSet="UTF-8" />;
    });
  };

  favicons = () => {
    const defaultFavicon = (
      <link rel="shortcut icon" href="/favicon.ico?client=true" />
    );
    const settings = this.settings;
    if (!settings) return defaultFavicon;

    const favicons = settings.attributes.faviconStyles;
    if (!favicons) return defaultFavicon;

    return (
      <React.Fragment>
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="16x16"
          href={favicons.small}
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="32x32"
          href={favicons.medium}
        />
        <link
          rel="shortcut icon"
          type="image/png"
          sizes="96x96"
          href={favicons.large}
        />
      </React.Fragment>
    );
  };

  render() {
    const { component, store, disableClientSideRender } = this.props;
    const content = component ? ReactDOM.renderToString(component) : null;
    const helmet = Helmet.renderStatic();
    const bodyClass = HigherOrder.BodyClass.rewind();
    const contentProps = {};
    if (content) {
      contentProps.dangerouslySetInnerHTML = { __html: content };
      contentProps["data-ssr-render"] = true;
    }

    return (
      <html lang="en-US">
        <head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, user-scalable=0"
          />
          {helmet.title.toComponent()}
          {helmet.meta.toComponent()}

          <script src="/browser.config.js" charSet="UTF-8" />

          {this.favicons()}
          {this.stylesheets()}
        </head>
        <body className={bodyClass}>
          <div id="content" {...contentProps} />
          {store && !disableClientSideRender ? (
            <script
              dangerouslySetInnerHTML={{
                __html: `window.__INITIAL_STATE__=${serialize(
                  store.getState()
                )};`
              }}
              charSet="UTF-8"
            />
          ) : null}
          {this.javascripts()}
        </body>
      </html>
    );
  }
}
