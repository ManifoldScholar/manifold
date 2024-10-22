import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usersAPI } from "api";
import { useFetch, usePaginationState } from "hooks";
import Layout from "backend/components/layout";
import EntitiesList, {
  ReadingGroupRow,
  AnnotationRow
} from "backend/components/list/EntitiesList";

export default function UserActivity({ user }) {
  const { t } = useTranslation();

  const [annotationsPagination, setAnnotationsPageNumber] = usePaginationState(
    1,
    5
  );

  const filters = useMemo(
    () => ({ formats: ["annotation"], order: "created_at DESC" }),
    []
  );

  const { data: annotations, meta: annotationsMeta } = useFetch({
    request: [usersAPI.annotations, user.id, filters, annotationsPagination]
  });

  const [rgPagination, setRgPageNumber] = usePaginationState(1, 5);

  const { data: rgMemberships, meta: rgMeta } = useFetch({
    request: [usersAPI.readingGroups, user.id, null, rgPagination]
  });

  return (
    <>
      {!!rgMemberships && (
        <Layout.BackendPanel flush>
          <EntitiesList
            entityComponent={ReadingGroupRow}
            entities={rgMemberships}
            title={t("glossary.reading_group_title_case", {
              count: rgMeta?.pagination.totalCount
            })}
            titleStyle="section"
            pagination={rgMeta?.pagination}
            paginationTarget={false}
            showCount
            unit={t("glossary.reading_group", {
              count: rgMeta?.pagination.totalCount
            })}
            callbacks={{
              onPageClick: page => () => setRgPageNumber(page)
            }}
          />
        </Layout.BackendPanel>
      )}
      {!!annotations && (
        <Layout.BackendPanel>
          <EntitiesList
            entityComponent={AnnotationRow}
            entityComponentProps={{ hideCreator: true }}
            entities={annotations}
            pagination={annotationsMeta?.pagination}
            paginationTarget={false}
            showCount
            unit={t("glossary.annotation", {
              count: annotationsMeta?.pagination.totalCount
            })}
            title={t("titles.annotations")}
            titleStyle="section"
            callbacks={{
              onPageClick: page => () => setAnnotationsPageNumber(page)
            }}
          />
        </Layout.BackendPanel>
      )}
    </>
  );
}
