import React from "react";
import IconComposer from "global/components/utility/IconComposer";
import Skeleton from "frontend/components/collecting/ContentSkeleton";

function Placeholder() {
  return (
    <div className="text-block text-block--loading">
      <div className="text-block__content" aria-hidden>
        <div className="text-block__inner">
          <figure className="text-block__cover text-block__cover--svg">
            <IconComposer
              size={78}
              icon="textsLoosePages64"
              className={`text-block__cover-svg`}
            />
          </figure>
          <div className="text-block__bibliographic">
            <h4 className="text-block__name">
              <Skeleton />
            </h4>
          </div>
        </div>
      </div>
      <div className="text-block__meta">
        <ul className="text-block__interaction-list">
          <li className="text-block__interaction">
            <IconComposer
              size={32}
              icon="interactAnnotate32"
              className={`text-block__interaction-icon`}
            />
            <span aria-hidden="true" className="text-block__interaction-label">
              0
            </span>
          </li>
          <li className="text-block__interaction">
            <IconComposer
              size={32}
              icon="interactHighlight32"
              className={`text-blcok__interaction-icon`}
            />
            <span aria-hidden="true" className="text-block__interaction-label">
              0
            </span>
          </li>
        </ul>
      </div>
      <span className="screen-reader-text">Loading</span>
    </div>
  );
}

Placeholder.className = "ReadingGroup.Collecting.TextPlaceholder";

export default Placeholder;
