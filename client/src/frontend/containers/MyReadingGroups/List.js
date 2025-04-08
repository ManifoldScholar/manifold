import React from "react";
import PropTypes from "prop-types";
import { meAPI } from "api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom-v5-compat";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import { useFetch, useCurrentUser, useListQueryParams } from "hooks";
import * as Styled from "./styles";

const DEFAULT_SORT_ORDER = "";

function MyReadingGroupsListContainer({ route }) {
  const filtersReset = {
    sort_order: DEFAULT_SORT_ORDER,
    archived: "false"
  };

  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: filtersReset
  });

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [meAPI.readingGroups, filters, pagination]
  });

  const showPlaceholder = "keyword" in filters ? false : !readingGroups?.length;

  const currentUser = useCurrentUser();
  const navigate = useNavigate();
  const { t } = useTranslation();

  function handleNewGroupSuccess() {
    navigate(lh.link("frontendMyReadingGroups"));
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
              filterProps={{
                onFilterChange: state => setFilters(state),
                initialState: filters,
                resetState: filtersReset
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
