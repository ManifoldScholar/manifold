import GroupsTable from "frontend/components/reading-group/tables/Groups";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import JoinBox from "frontend/components/reading-group/JoinBox";
import { GroupsHeading } from "frontend/components/reading-group/headings";
import { useCurrentUser, useListSearchParams } from "hooks";
import * as Styled from "./styles";

export default function ReadingGroupsList({
  readingGroups,
  meta,
  isPublic = false,
  defaultFilters
}) {
  const { filters, setFilters } = useListSearchParams({
    defaultFilters
  });

  const showPlaceholder = "keyword" in filters ? false : !readingGroups?.length;

  const currentUser = useCurrentUser();

  return readingGroups ? (
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
              resetState: defaultFilters
            }}
            showStatusFilter={!isPublic}
            hideActions={isPublic}
            hideTags={isPublic}
          />
        )}
        {showPlaceholder && (
          <EntityCollectionPlaceholder.ReadingGroups isPublic={isPublic} />
        )}
        {isPublic ? currentUser && <JoinBox /> : <JoinBox />}
      </Styled.Container>
    </section>
  ) : null;
}

ReadingGroupsList.displayName = "Frontend.Components.ReadingGroups.List";
