import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { usersAPI, readingGroupMembershipsAPI, annotationsAPI } from "api";
import {
  useFetch,
  usePaginationState,
  useApiCallback,
  useConfirmation,
  useFocusAfterRemoval,
  useSettings
} from "hooks";
import Layout from "components/backend/layout";
import EntitiesList, {
  ReadingGroupMembershipRow,
  AnnotationRow
} from "components/backend/list/EntitiesList";
import Dialog from "components/global/dialog";

export default function UserActivityRoute() {
  const { user } = useOutletContext();
  const { t } = useTranslation();
  const { confirm, confirmation } = useConfirmation();
  const settings = useSettings();

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
  } = useFetch(
    () => usersAPI.annotations(user.id, filters, annotationsPagination),
    [user.id, filters, annotationsPagination]
  );

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const {
    listRef: annotationsListRef,
    rememberRemoval: rememberAnnotationRemoval
  } = useFocusAfterRemoval(annotations);

  const onDeleteAnnotation = id => {
    confirm({
      heading: t("modals.delete_annotation"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        rememberAnnotationRemoval(id);
        await deleteAnnotation(id);
        closeDialog();
        refreshAnnotations();
      }
    });
  };

  const [rgPagination, setRgPageNumber] = usePaginationState(1, 5);

  const rgsDisabled = settings?.attributes?.general.disableReadingGroups;
  const {
    data: rgMemberships,
    meta: rgMeta,
    refresh: refreshRgs
  } = useFetch(
    () => usersAPI.readingGroupMemberships(user.id, null, rgPagination),
    [user.id, rgPagination],
    { condition: !rgsDisabled }
  );

  const deleteMembership = useApiCallback(readingGroupMembershipsAPI.destroy);

  const {
    listRef: rgListRef,
    rememberRemoval: rememberMembershipRemoval
  } = useFocusAfterRemoval(rgMemberships);

  const onDeleteMembership = (id, name, rg) => {
    confirm({
      heading: t("modals.delete_membership_group", { name, rg }),
      message: t("modals.delete_membership_body"),
      callback: async closeDialog => {
        rememberMembershipRemoval(id);
        await deleteMembership(id);
        closeDialog();
        refreshRgs();
      }
    });
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {!!rgMemberships && (
        <Layout.BackendPanel flush>
          <EntitiesList
            wrapperRef={rgListRef}
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
        <Layout.BackendPanel flush={!rgMemberships}>
          <EntitiesList
            wrapperRef={annotationsListRef}
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
