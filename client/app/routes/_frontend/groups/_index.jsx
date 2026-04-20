import { useTranslation } from "react-i18next";
import { readingGroupsAPI } from "api";
import checkLibraryMode from "lib/react-router/loaders/checkLibraryMode";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import loadList from "lib/react-router/loaders/loadList";
import HeadContent from "components/global/HeadContent";
import List from "components/frontend/reading-group-list/List";

const FILTERS_RESET = { sort_order: "created_at_asc" };

export const loader = async ({ request, context }) => {
  checkLibraryMode({ request, context });
  return loadList({
    request,
    context,
    fetchFn: readingGroupsAPI.publicIndex,
    options: { defaultFilters: FILTERS_RESET }
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__publicReadingGroupsHydrated",
  fetchFn: readingGroupsAPI.publicIndex,
  options: { defaultFilters: FILTERS_RESET }
});

export default function PublicReadingGroupsRoute({ loaderData }) {
  const { data: readingGroups, meta } = loaderData;
  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("pages.public_groups")} appendDefaultTitle />
      <List
        readingGroups={readingGroups}
        meta={meta}
        isPublic
        defaultFilters={FILTERS_RESET}
      />
    </>
  );
}
