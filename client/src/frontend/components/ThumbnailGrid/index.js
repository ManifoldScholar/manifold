import React from "react";
import {
  TransitionGroup as ReactTransitionGroup,
  CSSTransition
} from "react-transition-group";
import EntityThumbnail from "components/EntityThumbnail";

export default function ThumbnailGrid({ entities, onUncollect }) {
  return (
    <ReactTransitionGroup component="ul">
      {entities.map(entity => {
        return (
          <CSSTransition
            key={entity.id}
            enter={this.enableAnimation}
            exit={this.enableAnimation}
            timeout={{ enter: 250, exit: 250 }}
          >
            <li className="project-list__item--pos-rel">
              <EntityThumbnail project={entity} onUncollect={onUncollect} />
            </li>
          </CSSTransition>
        );
      })}
    </ReactTransitionGroup>
  );
}
