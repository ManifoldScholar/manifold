import { useTranslation } from "react-i18next";
import { userGroupsAPI } from "api";
import loadList from "lib/react-router/loaders/loadList";
import { useListQueryParams } from "hooks";
import EntitiesList, {
  Search,
  Button,
  UserGroupRow
} from "components/backend/list/EntitiesList";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ url, context }) => {
  return loadList({
    url,
    context,
    fetchFn: userGroupsAPI.index,
    options: {
      defaultFilters: INIT_FILTERS,
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function UserGroupsIndex({ loaderData }) {
  const { t } = useTranslation();

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: userGroups, meta } = loaderData;

  return (
    <EntitiesList
      title={t("records.user_groups.header")}
      titleStyle="bar"
      buttons={[
        <Button
          key="new"
          path="/backend/records/user-groups/new"
          text={t("records.user_groups.button_label")}
          type="add"
          authorizedFor="userGroup"
        />
      ]}
      search={<Search {...searchProps} />}
      entities={userGroups}
      entityComponent={UserGroupRow}
      pagination={meta?.pagination}
      showCount
      unit={t("glossary.user_group", {
        count: meta?.pagination?.totalCount
      })}
    />
  );
}
