import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { makersAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import { useListQueryParams } from "hooks";
import EntitiesList, {
  Search,
  Button,
  MakerRow
} from "backend/components/list/EntitiesList";
import { INIT_FILTERS, INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: makersAPI.index,
    options: {
      defaultFilters: { order: "last_name" },
      defaultPagination: { page: 1, perPage: 10 }
    }
  });
};

export default function MakersLayout({ loaderData }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: INIT_FILTERS,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const { data: makers, meta } = loaderData;

  return (
    <>
      <OutletWithDrawer
        drawerProps={{
          closeUrl: "/backend/records/makers",
          lockScroll: "always"
        }}
      />
      <EntitiesList
        title={t("records.makers.header")}
        titleStyle="bar"
        buttons={[
          <Button
            key="new"
            path="/backend/records/makers/new"
            text={t("records.makers.button_label")}
            type="add"
            authorizedFor="maker"
          />
        ]}
        search={<Search {...searchProps} />}
        entities={makers}
        entityComponent={MakerRow}
        entityComponentProps={{ active: id }}
        pagination={meta?.pagination}
        showCount
        unit={t("glossary.maker", {
          count: meta?.pagination?.totalCount
        })}
      />
    </>
  );
}
