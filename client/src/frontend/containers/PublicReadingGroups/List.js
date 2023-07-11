import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { readingGroupsAPI, requests } from "api";
import { childRoutes } from "helpers/router";
import HeadContent from "global/components/HeadContent";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
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

function PublicReadingGroupsListContainer({ route }) {
  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = {
    sort_order: DEFAULT_SORT_ORDER
  };
  const [filters, setFilters] = useFilterState(baseFilters);

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [readingGroupsAPI.publicIndex, filters, pagination],
    options: { requestKey: requests.fePublicReadingGroups }
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
  const { t } = useTranslation();

  const childRouteProps = {
    drawer: true,
    drawerProps: {
      context: "frontend",
      size: "wide",
      position: "overlay",
      lockScroll: "always"
    },
    childProps: {
      onSuccess: refresh
    }
  };

  return readingGroups ? (
    <>
      <HeadContent title={t("pages.public_groups")} appendDefaultTitle />
      <section>
        <Styled.Container>
          <GroupsHeading currentUser={currentUser} />
          {!showPlaceholder && (
            <GroupsTable
              readingGroups={readingGroups}
              currentUser={currentUser}
              pagination={meta?.pagination}
              onPageClick={paginationClickHandlerCreator}
              filterProps={{
                onFilterChange: param => setFilters({ newState: param }),
                initialState: filters,
                resetState: baseFilters
              }}
              hideActions
              hideTags
            />
          )}
          {showPlaceholder && (
            <EntityCollectionPlaceholder.ReadingGroups isPublic />
          )}
          {currentUser && <JoinBox onJoin={refresh} />}
        </Styled.Container>
      </section>
      {childRoutes(route, childRouteProps)}
    </>
  ) : null;
}

PublicReadingGroupsListContainer.propTypes = {
  route: PropTypes.object.isRequired
};

export default PublicReadingGroupsListContainer;
