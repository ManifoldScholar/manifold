import { useImperativeHandle, forwardRef } from "react";
import { meAPI } from "api";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import { useFetch, useCurrentUser, useListQueryParams } from "hooks";
import * as Styled from "./styles";

const DEFAULT_SORT_ORDER = "created_at_asc";
const FILTERS_RESET = {
  sort_order: DEFAULT_SORT_ORDER,
  archived: "false"
};

const MyReadingGroupsListContainer = forwardRef((props, ref) => {
  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: FILTERS_RESET
  });

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [meAPI.readingGroups, filters, pagination]
  });

  const showPlaceholder = "keyword" in filters ? false : !readingGroups?.length;

  const currentUser = useCurrentUser();
  const { t } = useTranslation();

  // Expose refresh function to parent via ref
  useImperativeHandle(ref, () => ({
    refresh
  }));

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
                resetState: FILTERS_RESET
              }}
              showStatusFilter
              onArchive={refresh}
            />
          )}
          {showPlaceholder && <EntityCollectionPlaceholder.ReadingGroups />}
          <JoinBox onJoin={refresh} />
        </Styled.Container>
      </section>
    </>
  ) : null;
});

MyReadingGroupsListContainer.displayName =
  "Frontend.Containers.MyReadingGroups.List";

export default MyReadingGroupsListContainer;
