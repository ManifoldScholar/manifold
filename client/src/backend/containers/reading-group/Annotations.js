import React from "react";
import Authorize from "hoc/Authorize";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { readingGroupsAPI, annotationsAPI } from "api";
import { withRouter } from "react-router-dom";
import {
  useFetch,
  usePaginationState,
  useApiCallback,
  useFilterState
} from "hooks";
import EntitiesList, {
  Search,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import withConfirmation from "hoc/withConfirmation";
import withFilteredLists, { annotationFilters } from "hoc/withFilteredLists";

function ReadingGroupAnnotationsContainer({
  refresh,
  readingGroup,
  route,
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const closeUrl = lh.link("backendReadingGroupAnnotations", readingGroup.id);

  const [pagination, setPageNumber] = usePaginationState();

  const baseFilters = entitiesListSearchParams.initialannotations;
  const [filters, setFilters] = useFilterState({
    ...baseFilters,
    formats: ["annotation"]
  });

  const { setParam, onReset, ...searchProps } = entitiesListSearchProps(
    "annotations"
  );
  const updatedSetParam = (param, value) => {
    setParam(param, value);
    setFilters({ newState: { ...filters, [param.as || param.name]: value } });
  };
  const updatedOnReset = () => {
    onReset();
    setFilters({
      newState: {
        ...baseFilters,
        formats: ["annotation"]
      }
    });
  };

  const { data, refresh: refreshAnnotations, meta } = useFetch({
    request: [
      readingGroupsAPI.annotations,
      readingGroup.id,
      filters,
      pagination
    ]
  });

  const { t } = useTranslation();

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDelete = (id, name) => {
    const heading = t("modals.delete_annotation", { name });
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteAnnotation(id);
        refreshAnnotations();
      });
  };

  if (!data) return null;

  return (
    <Authorize
      entity={readingGroup}
      ability="read"
      failureNotification
      failureRedirect={lh.link("backendReadingGroup", readingGroup.id)}
    >
      <EntitiesList
        entityComponent={AnnotationRow}
        entityComponentProps={{ readingGroup, onDelete }}
        title={t("reading_groups.annotations_header")}
        titleStyle="bar"
        titleTag="h2"
        entities={data}
        unit={t("glossary.annotation", {
          count: meta?.pagination?.totalCount || 0
        })}
        pagination={meta.pagination}
        search={
          <Search
            {...searchProps}
            setParam={updatedSetParam}
            onReset={updatedOnReset}
          />
        }
        showCount
        callbacks={{
          onPageClick: page => () => setPageNumber(page)
        }}
      />
      {childRoutes(route, {
        drawer: true,
        drawerProps: {
          lockScroll: "always",
          wide: true,
          lockScrollClickCloses: false,
          closeUrl
        },
        childProps: {
          refresh,
          refreshAnnotations,
          readingGroup,
          closeUrl: lh.link("backendReadingGroupAnnotations", readingGroup.id)
        }
      })}
    </Authorize>
  );
}

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object
};

export default withRouter(
  withConfirmation(
    withFilteredLists(ReadingGroupAnnotationsContainer, {
      annotations: annotationFilters({ includePrivacy: false })
    })
  )
);
