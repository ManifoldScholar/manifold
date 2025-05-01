import React from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import Event from "frontend/components/event";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function EventsEntityCollection({
  events,
  eventsMeta,
  paginationProps,
  ...passThroughProps
}) {
  const { t } = useTranslation();
  return (
    <EntityCollection
      title={t("pages.events_all")}
      icon="recentActivity64"
      BodyComponent={(props) => <Event.List events={events} {...props} />}
      paginationProps={
        isEmpty(eventsMeta)
          ? {}
          : {
              pagination: get(eventsMeta, "pagination"),
              ...paginationProps,
            }
      }
      {...passThroughProps}
    />
  );
}

EventsEntityCollection.displayName = "Frontend.Entity.Collection.Events";

EventsEntityCollection.propTypes = {
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  eventsMeta: PropTypes.object,
  paginationProps: shapes.pagination,
};

export default EventsEntityCollection;
