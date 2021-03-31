import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import {
  useDispatchReadingGroupCollected,
  useSelectReadingGroupCollected
} from "hooks";

function ReadingGroupHomepageContainer({ readingGroup, route, dispatch, history }) {
  const groupId = readingGroup.id;

  useDispatchReadingGroupCollected(groupId, "projects");
  useDispatchReadingGroupCollected(groupId, "texts");
  useDispatchReadingGroupCollected(groupId, "text_sections");
  useDispatchReadingGroupCollected(groupId, "resource_collections");
  useDispatchReadingGroupCollected(groupId, "resources");

  const responses = {
    projects: useSelectReadingGroupCollected("projects"),
    texts: useSelectReadingGroupCollected("texts"),
    textSections: useSelectReadingGroupCollected("text_sections"),
    resourceCollections: useSelectReadingGroupCollected("resource_collections"),
    resources: useSelectReadingGroupCollected("resources")
  };

  const refresh = () => {}

  return (
    <div style={{ marginTop: 60 }}>
      {childRoutes(route, {
        childProps: {
          readingGroup,
          responses,
          dispatch,
          history,
          refresh
        }
      })}
    </div>
  );
}

ReadingGroupHomepageContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupHomepageContainer;
