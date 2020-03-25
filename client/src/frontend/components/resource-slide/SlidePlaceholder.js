import React, { Component } from "react";
import Utility from "global/components/utility";

export default class ResourceListSlidePlaceholder extends Component {
  static displayName = "ResourceList.Slide.Placeholder";

  render() {
    return (
      <>
        <div
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
      </>
    );
  }
}
