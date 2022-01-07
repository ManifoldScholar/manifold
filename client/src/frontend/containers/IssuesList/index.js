import React from "react";
import PropTypes from "prop-types";
import {
  useSelectAllIssues,
  useSelectSettings,
  usePaginationState,
  useFilterState,
  useDispatchAllIssues,
  useUrlFromState
} from "hooks";
import EntityCollection from "frontend/components/composed/EntityCollection";
import Layout from "frontend/components/layout";
import { pageChangeHandlerCreator } from "helpers/pageChangeHandlerCreator";

export default function IssuesListContainer({ location }) {
  const { issues, issuesMeta } = useSelectAllIssues();
  const settings = useSelectSettings();
  const { filterState, updateFilterState } = useFilterState(location, {
    standaloneModeEnforced: false
  });
  const { paginationState, handlePageChange } = usePaginationState(location);

  useDispatchAllIssues(filterState, paginationState.number, "frontend");
  useUrlFromState(location, filterState, paginationState.number);

  // Update when we have the api
  // const hasVisibleIssues = settings?.attributes?.calculated?.hasVisibleIssues

  return issues ? (
    <>
      <h1 className="screen-reader-text">All Journal Issues</h1>
      <EntityCollection.Issues
        issues={issues}
        issuesMeta={issuesMeta}
        filterProps={{
          filterChangeHandler: filterParam =>
            updateFilterState({ param: filterParam }),
          initialFilterState: filterState,
          resetFilterState: () => updateFilterState({ reset: true })
        }}
        paginationProps={{
          paginationClickHandler: pageChangeHandlerCreator(handlePageChange)
        }}
        bgColor="neutral05"
      />
      {/* Replace true with hasVisibleIssues once we have the setting */}
      {true && (
        <Layout.ButtonNavigation
          showProjectCollections
          showProjects={false}
          grayBg={false}
        />
      )}
    </>
  ) : null;
  // Will there be a placeholder component like for projects?
  // if (this.showPlaceholder()) return <ProjectList.Placeholder />;
}

IssuesListContainer.propTypes = {
  location: PropTypes.object.isRequired
};
