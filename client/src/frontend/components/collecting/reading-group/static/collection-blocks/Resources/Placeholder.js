import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";

function Placeholder() {
  return (
    <div className="resource-link-placeholder" aria-hidden>
      <div className="icon-thumbnail-primary title">
        <div className="wrapper">
          <figure className="icon-thumbnail-type">
            <figcaption>
              <Skeleton nested style={{ maxWidth: 64, minHeight: 14 }} />
            </figcaption>
            <i className="icon-thumbnail-icon">
              <IconComposer icon="resources64" size={56} />
            </i>
          </figure>
          <h4 className="icon-thumbnail-title">
            <Skeleton nested style={{ width: "70%", marginLeft: "15%" }} />
          </h4>
        </div>
      </div>
    </div>
  );
}

Placeholder.className = "ReadingGroup.Collecting.ResourcePlaceholder";

export default Placeholder;
