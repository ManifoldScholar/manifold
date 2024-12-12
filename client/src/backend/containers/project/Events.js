import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import withConfirmation from "hoc/withConfirmation";
import { projectsAPI, eventsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Search,
  EventRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, { eventFilters } from "hoc/withFilteredLists";
import {
  usePaginationState,
  useSetLocation,
  useFetch,
  useApiCallback
} from "hooks";

import Authorize from "hoc/Authorize";

function ProjectEventsContainer({
  project,
  entitiesListSearchParams,
  entitiesListSearchProps,
  confirm
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: events, meta: eventsMeta, refresh } = useFetch({
    request: [
      projectsAPI.events,
      project.id,
      entitiesListSearchParams.events,
      pagination
    ],
    options: { requestKey: requests.beEvents },
    dependencies: [entitiesListSearchParams.events]
  });

  useSetLocation({
    filters: entitiesListSearchParams.events,
    page: pagination.number
  });

  const destroyEvent = useApiCallback(eventsAPI.destroy);

  const handleEventDestroy = event => {
    const heading = t("modals.delete_event");
    const message = t("modals.confirm_body");
    confirm(heading, message, async () => {
      await destroyEvent(event.id);
      refresh();
    });
  };

  if (!events || !eventsMeta) return null;

  return (
    <Authorize
      entity={project}
      ability="manageEvents"
      failureNotification
      failureRedirect={lh.link("backendProject", project.id)}
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
          callbacks={{
            onPageClick: page => e => {
              e.preventDefault();
              setPageNumber(page);
            }
          }}
          search={<Search {...entitiesListSearchProps("events")} />}
          usesQueryParams
        />
      </section>
    </Authorize>
  );
}

ProjectEventsContainer.displayName = "Project.Events";

ProjectEventsContainer.propTypes = {
  project: PropTypes.object,
  confirm: PropTypes.func.isRequired,
  refresh: PropTypes.func,
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withConfirmation(
  withFilteredLists(ProjectEventsContainer, {
    events: eventFilters()
  })
);
