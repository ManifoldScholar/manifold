import React from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import {
  useDispatchReadingGroupCollected,
  useSelectReadingGroupCollected,
  useDispatchReadingGroupCategories,
  useSelectReadingGroupCategories
} from "hooks";

function ReadingGroupHomepageFetchContainer({
  readingGroup,
  route,
  dispatch,
  history,
  refresh,
  fetchVersion
}) {
  const groupId = readingGroup.id;

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

  return (
    <div className="group-page-body">
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

ReadingGroupHomepageFetchContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  refresh: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default ReadingGroupHomepageFetchContainer;
