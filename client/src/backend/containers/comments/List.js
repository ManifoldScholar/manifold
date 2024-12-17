import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { commentsAPI } from "api";
import EntitiesList, {
  Search,
  CommentRow
} from "backend/components/list/EntitiesList";
import { useFetch, useApiCallback, useListQueryParams } from "hooks";
import withFilteredLists, { commentFilters } from "hoc/withFilteredLists";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import {
  useBulkActions,
  useClearBulkSelectionWithFilters,
  SelectAll
} from "backend/components/list/EntitiesList/List/bulkActions";

function CommentsList({
  route,
  confirm,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const { pagination, filters, searchProps } = useListQueryParams({
    initSize: 10,
    initFilters: {
      ...entitiesListSearchParams.initialcomments
    },
    initSearchProps: entitiesListSearchProps("comments")
  });

  const { data: comments, meta, refresh } = useFetch({
    request: [commentsAPI.adminIndex, filters, pagination],
    dependencies: [filters]
  });

  const {
    bulkActionsActive,
    resetBulkSelection,
    handleSelectAll,
    bulkSelection,
    bulkSelectionEmpty,
    addItem,
    removeItem
  } = useBulkActions(comments, filters);

  const { onReset, setParam } = useClearBulkSelectionWithFilters(
    searchProps.onReset,
    searchProps.setParam,
    resetBulkSelection,
    bulkSelectionEmpty
  );

  const destroyComment = useApiCallback(commentsAPI.destroy);

  const onDelete = id => {
    const heading = t("modals.delete_comment");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await destroyComment(id);
        refresh();
      });
  };

  const unit = t("glossary.comment", {
    count: meta?.pagination?.totalCount
  });

  // Bulk Delete logic: add back when API available

  // const bulkDelete = useApiCallback(bulkDeleteAPI.comments);

  // const notifyBulkDelete = useNotification(count => ({
  //   level: 0,
  //   id: "BULK_DELETE_SUCCESS",
  //   heading: t("notifications.bulk_delete_success"),
  //   body: t("notifications.bulk_delete_success_body", {
  //     count,
  //     entity: t("glossary.comment", { count })
  //   }),
  //   expiration: 5000
  // }));

  // const onBulkDelete = () => {
  //   const count = bulkSelection.filters
  //     ? meta?.pagination?.totalCount
  //     : bulkSelection.ids.length;
  //   const heading = t("modals.bulk_delete", { count, unit });
  //   const message = t("modals.confirm_body");
  //   if (confirm)
  //     confirm(heading, message, async () => {
  //       const params = bulkSelection.filters
  //         ? { filters: bulkSelection.filters, ids: [] }
  //         : { filters: {}, ids: bulkSelection.ids };
  //       const res = await bulkDelete(params);
  //       notifyBulkDelete(res.bulk_deletions.total);
  //       refresh();
  //       resetBulkSelection();
  //     });
  // };

  const renderChildRoutes = () => {
    const closeUrl = lh.link("backendRecordsComments");

    return childRoutes(route, {
      drawer: true,
      drawerProps: {
        lockScroll: "always",
        closeUrl
      },
      childProps: { refresh }
    });
  };

  return (
    <>
      {renderChildRoutes()}
      <PageHeader type="list" title={t("titles.comments")} />
      {!!comments && (
        <EntitiesList
          entityComponent={CommentRow}
          entityComponentProps={{
            bulkActionsActive,
            bulkSelection,
            addItem,
            removeItem,
            onDelete
          }}
          entities={comments}
          search={
            <Search {...searchProps} setParam={setParam} onReset={onReset} />
          }
          pagination={meta.pagination}
          showCount={
            bulkActionsActive ? (
              <SelectAll
                pagination={meta.pagination}
                unit={unit}
                onSelect={handleSelectAll}
                onClear={resetBulkSelection}
                allSelected={!!bulkSelection.filters}
              />
            ) : (
              true
            )
          }
          unit={unit}
        />
      )}
    </>
  );
}

export default withFilteredLists(withConfirmation(CommentsList), {
  comments: commentFilters()
});

CommentsList.displayName = "Comments.List";

CommentsList.propTypes = {
  route: PropTypes.object.isRequired,
  confirm: PropTypes.func.isRequired,
  entitiesListSearchProps: PropTypes.func,
  entitiesListSearchParams: PropTypes.object
};
