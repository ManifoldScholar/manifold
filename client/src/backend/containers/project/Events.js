import { useCallback } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import withConfirmation from "hoc/withConfirmation";
import { projectsAPI, eventsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Search,
  EventRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { eventFilters } from "hoc/withFilteredLists";
import { useListQueryParams, useFetch, useApiCallback } from "hooks";
import Authorize from "hoc/Authorize";

function ProjectEventsContainer({
  entitiesListSearchParams,
  entitiesListSearchProps,
  confirm
}) {
  const outletContext = useOutletContext() || {};
  const { project } = outletContext;
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: entitiesListSearchParams.events,
    initSearchProps: entitiesListSearchProps("events")
  });

  const { data: events, meta: eventsMeta, refresh } = useFetch({
    request: [projectsAPI.events, project.id, filters, pagination],
    options: { requestKey: requests.beEvents }
  });

  const destroyEvent = useApiCallback(eventsAPI.destroy);

  const handleEventDestroy = useCallback(
    event => {
      const heading = t("modals.delete_event");
      const message = t("modals.confirm_body");
      confirm(heading, message, async () => {
        await destroyEvent(event.id);
        refresh();
      });
    },
    [confirm, destroyEvent, refresh, t]
  );

  if (!project || !events || !eventsMeta) return null;

  return (
    <Authorize
      entity={project}
      ability="manageEvents"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
      <section>
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
            count: eventsMeta?.pagination?.totalCount
          })}
          pagination={eventsMeta.pagination}
          search={<Search {...searchProps} />}
        />
      </section>
    </Authorize>
  );
}

ProjectEventsContainer.displayName = "Project.Events";

export default withConfirmation(
  withFilteredLists(ProjectEventsContainer, {
    events: eventFilters()
  })
);
