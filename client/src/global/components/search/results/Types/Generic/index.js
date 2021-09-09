import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import has from "lodash/has";
import isPlainObject from "lodash/isPlainObject";
import Collecting from "frontend/components/collecting";
import withSearchResultHelper from "../searchResultHelper";
import Excerpts from "./Excerpts";

class SearchResultsTypeGeneric extends PureComponent {
  static displayName = "Search.Results.Type.Generic";

  get linked() {
    return this.hasProp("url");
  }

  isHtml(value) {
    return isPlainObject(value) && has(value, "__html");
  }

  hasProp(prop) {
    const value = this.props[prop];
    return Boolean(value);
  }

  attributesFor(prop) {
    const value = this.props[prop];
    const attributes = {};
    if (this.isHtml(value)) attributes.dangerouslySetInnerHTML = value;
    return attributes;
  }

  valueFor(prop) {
    const value = this.props[prop];
    if (this.isHtml(value)) return null;
    return value;
  }

  wrapWithLink({ url, contents, tabIndex = 0 }) {
    if (!url) return contents;
    return (
      <Link to={url} className="search-result__title-link" tabIndex={tabIndex}>
        {contents}
      </Link>
    );
  }

  render() {
    return (
      <li className="search-result">
        <article className="search-result__content-wrapper">
          <div className="search-result__figure-column">
            {this.hasProp("figure") &&
              this.wrapWithLink({
                url: this.props.url,
                contents: (
                  <figure
                    className="search-result__figure"
                    {...this.attributesFor("figure")}
                  >
                    {this.valueFor("figure")}
                  </figure>
                ),
                tabIndex: -1
              })}
          </div>
          <div className="search-result__text-column">
            <div className="search-result__text-column-top">
              <div className="search-result__text-column-top-left">
                {this.hasProp("parent") && !this.props.hideParent && (
                  <div
                    className="search-result__parent"
                    {...this.attributesFor("parent")}
                  >
                    {this.wrapWithLink({
                      url: this.props.parentUrl,
                      contents: this.valueFor("parent")
                    })}
                  </div>
                )}
                {this.hasProp("title") &&
                  this.wrapWithLink({
                    url: this.props.url,
                    contents: (
                      <h3
                        className="search-result__title"
                        {...this.attributesFor("title")}
                      >
                        {this.valueFor("title")}
                      </h3>
                    )
                  })}
                {this.hasProp("attribution") && (
                  <address className="search-result__attribution">
                    <span {...this.attributesFor("attribution")}>
                      <em>by</em> {this.valueFor("attribution")}
                    </span>
                  </address>
                )}
              </div>
              <div className="search-result__text-column-top-right">
                <div className="search-result__label">
                  {this.valueFor("label")}
                </div>
                {this.hasProp("collectable") && (
                  <div className="search-result__collecting-toggle">
                    <Collecting.Toggle
                      collectable={this.valueFor("collectable")}
                    />
                  </div>
                )}
              </div>
            </div>
            {this.hasProp("description") && (
              <p
                className="search-result__description"
                {...this.attributesFor("description")}
              >
                {this.valueFor("description")}
              </p>
            )}
            {this.hasProp("excerpts") && (
              <Excerpts excerpts={this.valueFor("excerpts")} />
            )}
            {this.hasProp("meta") && (
              <p
                className="search-result__meta"
                {...this.attributesFor("meta")}
              >
                {this.valueFor("meta")}
              </p>
            )}
          </div>
        </article>
      </li>
    );
  }
}

export default withSearchResultHelper(SearchResultsTypeGeneric);
