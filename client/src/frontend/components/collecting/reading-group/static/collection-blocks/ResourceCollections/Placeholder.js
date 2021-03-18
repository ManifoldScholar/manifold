import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";

function Placeholder() {
  return (
    <li>
      <div aria-hidden className="cover-placeholder">
        <div className="title-overlay title-overlay--placeholder">
          <div className="collection-title">
            <Skeleton nested style={{ height: 20, maxWidth: 200 }} />
          </div>
          <div className="icon">
            <IconComposer size={48} icon="resourceCollection64" />
            <span>{"Collection"}</span>
          </div>
        </div>
      </div>
    </li>
  );
}

Placeholder.className = "ReadingGroup.Collecting.ResourceCollectionPlaceholder";

export default Placeholder;
