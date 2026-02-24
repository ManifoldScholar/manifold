import { useTranslation } from "react-i18next";
import { readingGroupsAPI, requests } from "api";
import HeadContent from "global/components/HeadContent";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import GroupsTable from "frontend/components/reading-group/tables/Groups";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import { useFetch, useCurrentUser, useListQueryParams } from "hooks";
import * as Styled from "./styles";

const DEFAULT_SORT_ORDER = "created_at_asc";

function PublicReadingGroupsListContainer() {
  const filtersReset = {
    sort_order: DEFAULT_SORT_ORDER
  };
  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: filtersReset
  });

  const { data: readingGroups, meta, refresh } = useFetch({
    request: [readingGroupsAPI.publicIndex, filters, pagination],
    options: { requestKey: requests.fePublicReadingGroups }
  });

  const showPlaceholder = "keyword" in filters ? false : !readingGroups?.length;

  const currentUser = useCurrentUser();
  const { t } = useTranslation();

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
              filterProps={{
                onFilterChange: state => setFilters(state),
                initialState: filters,
                resetState: filtersReset
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
    </>
  ) : null;
}

export default PublicReadingGroupsListContainer;
