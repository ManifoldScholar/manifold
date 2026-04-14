import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { projectsAPI, eventsAPI } from "api";
import loadList from "app/routes/utility/loaders/loadList";
import { useListQueryParams, useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "global/components/dialog";
import EntitiesList, {
  Search,
  EventRow
} from "components/backend/list/EntitiesList";
import { INIT_SEARCH_PROPS } from "./filters";

export const loader = async ({ params, request, context }) => {
  return loadList({
    request,
    context,
    fetchFn: (filters, pagination) =>
      projectsAPI.events(params.id, filters, pagination),
    options: { defaultPagination: { page: 1, perPage: 10 } }
  });
};

export default function ProjectEvents({ loaderData }) {
  const { t } = useTranslation();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();
  const { data: events, meta } = loaderData;

  const { searchProps } = useListQueryParams({
    initSize: 10,
    initSearchProps: INIT_SEARCH_PROPS
  });

  const destroyEvent = useApiCallback(eventsAPI.destroy);

  const handleEventDestroy = event => {
    confirm({
      heading: t("modals.delete_event"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await destroyEvent(event.id);
        closeDialog();
        revalidate();
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <EntitiesList
        entityComponent={EventRow}
        entityComponentProps={{
          destroyHandler: handleEventDestroy
        }}
        entities={events}
        listStyle="tiles"
        showCount
        title={t("projects.activity")}
        titleIcon="BENews64"
        titleStyle="bar"
        titleTag="h2"
        unit={t("glossary.event", {
          count: meta?.pagination?.totalCount
        })}
        pagination={meta?.pagination}
        search={<Search {...searchProps} />}
      />
    </>
  );
}
