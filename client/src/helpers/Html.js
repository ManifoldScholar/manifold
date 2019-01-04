import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom/server";
import serialize from "serialize-javascript";
import Helmet from "react-helmet";
import reduce from "lodash/reduce";
import isString from "lodash/isString";
import isArray from "lodash/isArray";
import endsWith from "lodash/endsWith";
import get from "lodash/get";
import BodyClass from "hoc/body-class";

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
    disableBrowserRender: PropTypes.bool
  };

  get settings() {
    if (!this.props.store) return null;
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
        if (!["build/manifold-client-browser"].includes(chunkName))
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
    return scripts.map(script => {
      return <script src={`/${script}`} key={script} charSet="UTF-8" />;
    });
  };

  favicons = () => {
    const favicons = get(this.settings, "attributes.faviconStyles");
    if (!favicons || !favicons.original) {
      return (
        <link rel="shortcut icon" href="/static/favicon.ico?client=true" />
      );
    }
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
    const { component, store, disableBrowserRender } = this.props;
    const content = component ? ReactDOM.renderToString(component) : null;
    const helmet = Helmet.renderStatic();
    const bodyClass = BodyClass.rewind();
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
