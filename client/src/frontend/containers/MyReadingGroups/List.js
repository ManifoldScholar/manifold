import React from "react";
import PropTypes from "prop-types";
import { meAPI } from "api";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useCurrentUser
} from "hooks";
import * as Styled from "./styles";

const DEFAULT_SORT_ORDER = "";

function MyReadingGroupsListContainer({ route }) {
  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = {
    sort_order: DEFAULT_SORT_ORDER,
    archived: "false"
  };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [meAPI.readingGroups, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

  const showPlaceholder = "keyword" in filters ? false : !readingGroups?.length;

  const currentUser = useCurrentUser();
  const history = useHistory();
  const { t } = useTranslation();

  function handleNewGroupSuccess() {
    history.push(lh.link("frontendMyReadingGroups"));
    refresh();
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
      <HeadContent title={t("pages.my_groups")} appendDefaultTitle />
      <section>
        <Styled.Container>
          <GroupsHeading currentUser={currentUser} />
          {!showPlaceholder && (
            <GroupsTable
              readingGroups={readingGroups}
              pagination={meta?.pagination}
              onPageClick={paginationClickHandlerCreator}
              filterProps={{
                onFilterChange: param => setFilters({ newState: param }),
                initialState: filters,
                resetState: baseFilters
              }}
              showStatusFilter
              onArchive={refresh}
            />
          )}
          {showPlaceholder && <EntityCollectionPlaceholder.ReadingGroups />}
          <JoinBox onJoin={refresh} />
        </Styled.Container>
      </section>
      {childRoutes(route, childRouteProps)}
    </>
  ) : null;
}

MyReadingGroupsListContainer.propTypes = {
  route: PropTypes.object.isRequired
};

export default MyReadingGroupsListContainer;
