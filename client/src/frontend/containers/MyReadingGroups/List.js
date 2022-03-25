import React, { useState } from "react";
import PropTypes from "prop-types";
import { meAPI } from "api";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
import EntityCollectionPlaceholder from "global/components/composed/EntityCollectionPlaceholder";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useCurrentUser
} from "hooks";

const DEFAULT_SORT_ORDER = "";

function MyReadingGroupsListContainer({ route }) {
  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = {
    sort_order: DEFAULT_SORT_ORDER
  };
  const [filters, setFilters] = useFilterState(baseFilters);

  const [rgJoins, setRGJoins] = useState(0);
  const { data: readingGroups, meta } = useFetch({
    request: [meAPI.readingGroups, filters, pagination],
    dependencies: [rgJoins]
  });

  useSetLocation({ filters, page: pagination.number });

  const showPlaceholder = "keyword" in filters ? false : !readingGroups?.length;

  const currentUser = useCurrentUser();
  const history = useHistory();
  const { t } = useTranslation();

  function handleNewGroupSuccess() {
    history.push(lh.link("frontendMyReadingGroups"));
    setRGJoins(prev => prev + 1);
  }

  const childRouteProps = {
    drawer: true,
    drawerProps: {
      context: "frontend",
      size: "wide",
      position: "overlay",
      lockScroll: "always",
      closeUrl: lh.link("frontendMyReadingGroups")
    },
    childProps: {
      onSuccess: handleNewGroupSuccess
    }
  };

  return readingGroups ? (
    <>
      <HeadContent title={t("pages.frontend.my_groups")} appendDefaultTitle />
      <section>
        <div className="container groups-page-container">
          <GroupsHeading currentUser={currentUser} />
          {!showPlaceholder && (
            <GroupsTable
              readingGroups={readingGroups}
              pagination={meta?.pagination}
              onPageClick={page => () => setPageNumber(page)}
              filterProps={{
                onFilterChange: param => setFilters({ newState: param }),
                initialState: filters,
                resetState: baseFilters
              }}
            />
          )}
          {showPlaceholder && <EntityCollectionPlaceholder.ReadingGroups />}
          <JoinBox onJoin={() => setRGJoins(prev => prev + 1)} />
        </div>
      </section>
      {childRoutes(route, childRouteProps)}
    </>
  ) : null;
}

MyReadingGroupsListContainer.propTypes = {
  route: PropTypes.object.isRequired
};

export default MyReadingGroupsListContainer;
