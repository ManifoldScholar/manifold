import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usersAPI } from "api";
import EntitiesList, {
  UserRow,
  Search
} from "backend/components/list/EntitiesList";
import { useListQueryParams, useFetch } from "hooks";
import withFilteredLists, { userFilters } from "hoc/withFilteredLists";

function UserGroupUsers({
  userGroup: ignored,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.users,
    initSearchProps: entitiesListSearchProps("users")
  });

  const { data: users, meta: usersMeta } = useFetch({
    request: [usersAPI.index, filters, pagination]
  });

  const unit = t("glossary.user", { count: usersMeta?.pagination?.totalCount });

  const [allVisible, setAllVisible] = useState(false);

  if (!users || !usersMeta) return null;

  const toggleLabel = !allVisible ? "Add Members" : "Show Members Only";

  return (
    <div>
      <EntitiesList
        title={t("records.user_groups.users.header")}
        titleStyle="bar"
        titleActions={[
          {
            label: toggleLabel,
            onClick: () => setAllVisible(!allVisible),
            icon: !allVisible ? "circlePlus24" : "circleMinus24"
          }
        ]}
        entityComponent={UserRow}
        entityComponentProps={{ onGroupRemove: () => {} }}
        entities={allVisible ? users : []}
        unit={unit}
        pagination={allVisible ? usersMeta.pagination : undefined}
        showCount={allVisible}
        search={<Search {...searchProps} />}
      />
    </div>
  );
}

export default withFilteredLists(UserGroupUsers, {
  users: userFilters()
});
