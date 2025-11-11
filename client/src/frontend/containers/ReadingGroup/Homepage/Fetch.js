import { readingGroupsAPI } from "api";
import { Outlet, useOutletContext } from "react-router-dom";
import { useFetch } from "hooks";
import * as Styled from "../styles";

function ReadingGroupHomepageFetchContainer() {
  const { readingGroup, refresh, fetchVersion } = useOutletContext() || {};

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
      <Outlet
        context={{
          readingGroup,
          categories,
          responses,
          refresh
        }}
      />
    </Styled.Body>
  );
}

export default ReadingGroupHomepageFetchContainer;
