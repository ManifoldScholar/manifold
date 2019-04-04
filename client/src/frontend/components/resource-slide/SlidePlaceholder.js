import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "global/components/utility";

export default class ResourceListSlidePlaceholder extends Component {
  static displayName = "ResourceSlide.Placeholder";

  static propTypes = {};

  componentDidMount() {
    if (!this._figure) return null;
    const parentWidth = this._figure.parentNode.offsetWidth;
    this._figure.style.width = parentWidth + "px";
  }

  render() {
    return (
      <figure>
        <div
          ref={c => {
            this._figure = c;
          }}
          className="figure-default"
          style={{
            backgroundImage: "url(/static/images/resource-collection.jpg)"
          }}
        >
          <div className="resource-info">
            <Utility.IconComposer
              size={120}
              icon="resourceCollection64"
              iconClass="resource-slide-figure__resource-icon"
            />
            <span className="resource-type">
              {"This collection has no resources"}
            </span>
          </div>
        </div>
      </figure>
    );
  }
}
