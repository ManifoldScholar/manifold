import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import {
  useDispatchReadingGroupCollected,
  useSelectReadingGroupCollected,
  useDispatchReadingGroupCategories,
  useSelectReadingGroupCategories
} from "hooks";

function ReadingGroupHomepageContainer({
  readingGroup,
  route,
  dispatch,
  history,
  onRefresh
}) {
  const groupId = readingGroup.id;
  const [fetchVersion, setFetchVersion] = useState(1);

  useDispatchReadingGroupCategories(groupId, fetchVersion);

  useDispatchReadingGroupCollected(groupId, "projects", fetchVersion);
  useDispatchReadingGroupCollected(groupId, "texts", fetchVersion);
  useDispatchReadingGroupCollected(groupId, "text_sections", fetchVersion);
  useDispatchReadingGroupCollected(
    groupId,
    "resource_collections",
    fetchVersion
  );
  useDispatchReadingGroupCollected(groupId, "resources", fetchVersion);

  const categories = useSelectReadingGroupCategories() || [];

  const responses = {
    projects: useSelectReadingGroupCollected("projects"),
    texts: useSelectReadingGroupCollected("texts"),
    textSections: useSelectReadingGroupCollected("text_sections"),
    resourceCollections: useSelectReadingGroupCollected("resource_collections"),
    resources: useSelectReadingGroupCollected("resources")
  };

  const refresh = useCallback(
    () => {
      setFetchVersion(current => current + 1);
      onRefresh();
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <div style={{ marginTop: 60 }}>
      {childRoutes(route, {
        childProps: {
          readingGroup,
          categories,
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
  onRefresh: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupHomepageContainer;
