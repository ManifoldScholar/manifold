import React, { Component } from "react";
import Utility from "global/components/utility";

export default class ResourceListSlideFigureLoading extends Component {
  static displayName = "ResourceList.Slide.Loading";

  render() {
    return (
      <figure>
        <div
          className="figure-default"
          style={{ backgroundImage: "url(/static/images/resource-splash.png)" }}
        >
          <div className="resource-info">
            <Utility.IconComposer
              size={120}
              icon="resourceFile64"
              iconClass="resource-slide-figure__resource-icon"
            />
            <span className="resource-type">{"loading"}</span>
            <span className="resource-date">{"loading"}</span>
          </div>
        </div>
      </figure>
    );
  }
}
