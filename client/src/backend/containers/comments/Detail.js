import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useParams, useHistory } from "react-router-dom";
import { useFetch, useApiCallback } from "hooks";
import { commentsAPI } from "api";
import lh from "helpers/linkHandler";
import {
  FlagsList,
  Body,
  Metadata
} from "backend/components/annotation/detail";
import withConfirmation from "hoc/withConfirmation";

function CommentDetailContainer({ refresh, confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();

  const { data: comment, refresh: refreshComment } = useFetch({
    request: [commentsAPI.show, id],
    condition: !!id
  });

  const deleteComment = useApiCallback(commentsAPI.destroy);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_comment");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteComment(id);
        refresh();
        history.push(lh.link("backendRecordsComments"));
      });
  }, [id, confirm, deleteComment, t, history, refresh]);

  const { attributes, relationships } = comment ?? {};

  const {
    body,
    flagsCount,
    unresolvedFlagsCount,
    resolvedFlagsCount,
    createdAt,
    subjectId,
    subjectTitle,
    subjectTextTitle,
    subjectTextSlug,
    subjectTextSectionId,
    subjectType,
    projectSlug
  } = attributes ?? {};

  const { creator, flags } = relationships ?? {};

  const metadataProps = {
    creator,
    createdAt,
    subjectTitle,
    textTitle: subjectTextTitle
  };

  const resolveFlags = useApiCallback(commentsAPI.resolveAllFlags);

  const handleResolveFlags = useCallback(() => {
    const heading = t("modals.resolve_flags");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await resolveFlags(id);
        refreshComment();
      });
  }, [id, confirm, resolveFlags, t, refreshComment]);

  const viewProps =
    subjectType === "Resource"
      ? {
          route: "frontendProjectResource",
          routeParams: [projectSlug, subjectId]
        }
      : {
          route: "readerSection",
          routeParams: [
            subjectTextSlug,
            subjectTextSectionId,
            `#annotation-${subjectId}`
          ]
        };

  return id ? (
    <section>
      <Layout.DrawerHeader
        title={t("records.comments.detail_header")}
        buttons={[
          {
            label: "actions.view",
            icon: "eyeOpen32",
            ...viewProps
          },
          {
            label: t("actions.delete"),
            icon: "delete24",
            ability: "delete",
            entity: comment,
            onClick: onDelete
          },
          ...(unresolvedFlagsCount
            ? [
                {
                  label: t("records.annotations.resolve_all_label"),
                  icon: "circleMinus24",
                  ability: "update",
                  entity: comment,
                  onClick: handleResolveFlags
                }
              ]
            : [])
        ]}
      />
      {!!flagsCount && (
        <FlagsList
          flags={flags}
          resolvedFlagsCount={resolvedFlagsCount}
          unresolvedFlagsCount={unresolvedFlagsCount}
        />
      )}
      <Body body={body} />
      <Metadata {...metadataProps} isComment />
    </section>
  ) : null;
}

export default withConfirmation(CommentDetailContainer);

CommentDetailContainer.displayName = "Comments.CommentDetail";

CommentDetailContainer.propTypes = {
  refresh: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};
