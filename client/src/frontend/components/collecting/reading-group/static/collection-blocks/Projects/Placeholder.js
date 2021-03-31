import React from "react";
import Skeleton from "frontend/components/collecting/ContentSkeleton";

function Placeholder() {
  return (
    <div className="item-wrapper" aria-hidden>
      <figure className="cover">
        <Skeleton style={{ maxWidth: 110 }} />
      </figure>
      <div className="meta">
        <h3 className="name">
          <Skeleton style={{ maxWidth: 300 }} />
        </h3>
        <div className="relations-list">
          <span>
            <Skeleton style={{ width: "75%", maxWidth: 250 }} />
          </span>
        </div>
        <div className="date">
          <Skeleton style={{ maxWidth: 75 }} />
        </div>
      </div>
    </div>
  );
}

Placeholder.className = "ReadingGroup.Collecting.ProjectPlaceholder";

export default Placeholder;
