import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router-dom";
import { usersAPI, readingGroupMembershipsAPI, annotationsAPI } from "api";
import { useFetch, usePaginationState, useApiCallback } from "hooks";
import Layout from "backend/components/layout";
import EntitiesList, {
  ReadingGroupMembershipRow,
  AnnotationRow
} from "backend/components/list/EntitiesList";
import withConfirmation from "hoc/withConfirmation";

function UserActivityContainer({ confirm }) {
  const outletContext = useOutletContext() || {};
  const { user } = outletContext;
  const { t } = useTranslation();

  const [annotationsPagination, setAnnotationsPageNumber] = usePaginationState(
    1,
    5
  );

  const filters = useMemo(
    () => ({ formats: ["annotation"], order: "created_at DESC" }),
    []
  );

  const {
    data: annotations,
    meta: annotationsMeta,
    refresh: refreshAnnotations
  } = useFetch({
    request: [usersAPI.annotations, user.id, filters, annotationsPagination]
  });

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDeleteAnnotation = id => {
    const heading = t("modals.delete_annotation");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteAnnotation(id);
        refreshAnnotations();
      });
  };

  const [rgPagination, setRgPageNumber] = usePaginationState(1, 5);

  const { data: rgMemberships, meta: rgMeta, refresh: refreshRgs } = useFetch({
    request: [usersAPI.readingGroupMemberships, user.id, null, rgPagination]
  });

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const onDeleteMembership = (id, name, rg) => {
    const heading = t("modals.delete_membership_group", { name, rg });
    const message = t("modals.delete_membership_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteMembership(id);
        refreshRgs();
      });
  };

  return (
    <>
      {!!rgMemberships && (
        <Layout.BackendPanel flush>
          <EntitiesList
            entityComponent={ReadingGroupMembershipRow}
            entityComponentProps={{ onDelete: onDeleteMembership }}
            entities={rgMemberships}
            title={t("glossary.reading_group_title_case", {
              count: 10
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
            entityComponentProps={{
              hideCreator: true,
              onDelete: onDeleteAnnotation
            }}
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

export default withConfirmation(UserActivityContainer);
