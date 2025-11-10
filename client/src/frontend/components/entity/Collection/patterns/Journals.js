import React from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import { useTranslation } from "react-i18next";
import isEmpty from "lodash/isEmpty";
import EntityThumbnail from "global/components/atomic/EntityThumbnail";
import ThumbnailGrid from "global/components/entity/ThumbnailGrid";
import EntityCollection from "../EntityCollection";
import * as shapes from "../shapes";

function JournalsEntityCollection({
  journals,
  meta,
  filterProps,
  paginationProps,
  ...passThroughProps
}) {
  const { t } = useTranslation();

  const showFilters = !isEmpty(meta) && !isEmpty(filterProps);
  return (
    <EntityCollection
      title={t("titles.journals_all")}
      icon="journals64"
      filterProps={showFilters ? filterProps : null}
      BodyComponent={props => (
        <ThumbnailGrid isList={journals.length > 1} {...props}>
          {({ stack }) =>
            journals.map(item => (
              <EntityThumbnail
                key={item.id}
                entity={item}
                stack={stack}
                isListItem={journals.length > 1}
              />
            ))
          }
        </ThumbnailGrid>
      )}
      countProps={
        isEmpty(meta)
          ? {}
          : {
              pagination: get(meta, "pagination"),
              unit: t("glossary.journal", {
                count: meta?.pagination?.totalCount || 0
              })
            }
      }
      paginationProps={
        isEmpty(meta)
          ? {}
          : {
              pagination: get(meta, "pagination"),
              ...paginationProps
            }
      }
      {...passThroughProps}
    />
  );
}

JournalsEntityCollection.displayName = "Frontend.Entity.Collection.Journals";

JournalsEntityCollection.propTypes = {
  journals: PropTypes.arrayOf(PropTypes.object).isRequired,
  meta: PropTypes.object,
  filterProps: shapes.filters,
  paginationProps: shapes.pagination
};

export default JournalsEntityCollection;
