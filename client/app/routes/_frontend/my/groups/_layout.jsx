import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import requireLogin from "lib/react-router/loaders/requireLogin";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import loadList from "lib/react-router/loaders/loadList";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import HeadContent from "components/global/HeadContent";
import List from "components/frontend/reading-group-list/List";

const FILTERS_RESET = { sort_order: "created_at_asc", archived: "false" };

export const loader = async ({ request, context }) => {
  requireLogin(request, context);
  return loadList({
    request,
    context,
    fetchFn: meAPI.readingGroups,
    options: { defaultFilters: FILTERS_RESET }
  });
};

export const clientLoader = createListClientLoader({
  hydrateKey: "__myReadingGroupsHydrated",
  fetchFn: meAPI.readingGroups,
  options: { defaultFilters: FILTERS_RESET }
});

export default function MyReadingGroupsLayout({ loaderData }) {
  const { data: readingGroups, meta } = loaderData;
  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("pages.my_groups")} appendDefaultTitle />
      <List
        readingGroups={readingGroups}
        meta={meta}
        defaultFilters={FILTERS_RESET}
      />
      <OutletWithDrawers
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl: "/my/groups"
        }}
      />
    </>
  );
}
