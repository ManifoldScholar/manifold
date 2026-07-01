import { useCallback, useEffect, useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import withConfirmation from "hoc/withConfirmation";
import { projectsAPI, eventsAPI } from "api";
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
    request: [projectsAPI.events, project.id, filters, pagination]
  });

  const destroyEvent = useApiCallback(eventsAPI.destroy);

  // Deleting an event unmounts its row after an async refetch, which strips
  // keyboard focus. Record where focus should land before deleting, then move
  // it there once the refreshed list has committed (see the effect below).
  const pendingFocus = useRef(null); // null = nothing pending; else { neighborId }
  const sectionRef = useRef(null);

  const handleEventDestroy = useCallback(
    event => {
      const heading = t("modals.delete_event");
      const message = t("modals.confirm_body");
      confirm(heading, message, async () => {
        const index = events.findIndex(e => e.id === event.id);
        const neighbor = events[index + 1] ?? events[index - 1];
        pendingFocus.current = { neighborId: neighbor?.id ?? null };
        await destroyEvent(event.id);
        await refresh();
      });
    },
    [confirm, destroyEvent, refresh, t, events]
  );

  useEffect(() => {
    if (!pendingFocus.current) return;
    const { neighborId } = pendingFocus.current;
    pendingFocus.current = null;
    const root = sectionRef.current;
    if (!root) return;
    const neighborControl =
      neighborId &&
      root.querySelector(`[data-event-id="${neighborId}"] [data-id="destroy"]`);
    // Fallback to the list region itself when no events remain.
    (neighborControl ?? root).focus();
  }, [events]);

  if (!project || !events || !eventsMeta) return null;

  return (
    <Authorize
      entity={project}
      ability="manageEvents"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
      <section
        ref={sectionRef}
        tabIndex={-1}
        aria-label={t("projects.activity")}
      >
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
