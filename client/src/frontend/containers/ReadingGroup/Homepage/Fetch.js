import React from "react";
import PropTypes from "prop-types";
import { readingGroupsAPI } from "api";
import { useHistory } from "react-router-dom";
import { childRoutes } from "helpers/router";
import { useFetch, useFromStore } from "hooks";

function ReadingGroupHomepageFetchContainer({
  readingGroup,
  route,
  refresh,
  fetchVersion
}) {
  const history = useHistory();

  const { data: projects } = useFetch({
    request: [readingGroupsAPI.collected, readingGroup.id, "projects"],
    dependencies: [fetchVersion]
  });
  const { data: texts } = useFetch({
    request: [readingGroupsAPI.collected, readingGroup.id, "texts"],
    dependencies: [fetchVersion]
  });
  const { data: textSections } = useFetch({
    request: [readingGroupsAPI.collected, readingGroup.id, "text_sections"],
    dependencies: [fetchVersion]
  });
  const { data: resourceCollections } = useFetch({
    request: [
      readingGroupsAPI.collected,
      readingGroup.id,
      "resource_collections"
    ],
    dependencies: [fetchVersion]
  });
  const { data: resources } = useFetch({
    request: [readingGroupsAPI.collected, readingGroup.id, "resources"],
    dependencies: [fetchVersion]
  });

  const responses = {
    projects,
    texts,
    textSections,
    resourceCollections,
    resources
  };

  const categories = useFromStore("feReadingGroupCategories", "select") || [];

  return (
    <div className="group-page-body">
      {childRoutes(route, {
        childProps: {
          readingGroup,
          categories,
          responses,
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
  refresh: PropTypes.func.isRequired,
  fetchVersion: PropTypes.number.isRequired
};

export default ReadingGroupHomepageFetchContainer;
