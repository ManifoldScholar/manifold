import React from "react";
import PropTypes from "prop-types";
import { readingGroupsAPI } from "api";
import { useHistory } from "react-router-dom";
import { childRoutes } from "helpers/router";
import { useFetch } from "hooks";
import * as Styled from "../styles";

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
  const { data: journalIssues } = useFetch({
    request: [readingGroupsAPI.collected, readingGroup.id, "journal_issues"],
    dependencies: [fetchVersion]
  });

  const responses = {
    projects,
    texts,
    textSections,
    resourceCollections,
    resources,
    journalIssues
  };

  const { data: categories } = useFetch({
    request: [readingGroupsAPI.categories, readingGroup.id],
    dependencies: [fetchVersion]
  });

  return (
    <Styled.Body>
      {childRoutes(route, {
        childProps: {
          readingGroup,
          categories,
          responses,
          history,
          refresh
        }
      })}
    </Styled.Body>
  );
}

ReadingGroupHomepageFetchContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  fetchVersion: PropTypes.number.isRequired
};

export default ReadingGroupHomepageFetchContainer;
