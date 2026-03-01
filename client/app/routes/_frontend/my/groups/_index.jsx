import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import requireLogin from "app/routes/utility/loaders/requireLogin";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import HeadContent from "global/components/HeadContent";
import List from "frontend/components/reading-group-list/List";

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
      <OutletWithDrawer
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
