import { useTranslation } from "react-i18next";
import { useNavigate, useRevalidator } from "react-router";
import { commentsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Layout from "components/backend/layout";
import Dialog from "components/global/dialog";

import {
  FlagsList,
  Body,
  Metadata
} from "components/backend/annotation/detail";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => commentsAPI.show(params.id),
    request
  });
};

export default function CommentDetail({ loaderData: comment }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const deleteComment = useApiCallback(commentsAPI.destroy);
  const resolveFlags = useApiCallback(commentsAPI.resolveAllFlags);

  const onDelete = () => {
    confirm({
      heading: t("modals.delete_comment"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await deleteComment(comment.id);
          navigate("/backend/records/comments");
        } catch {
          closeDialog();
        }
      }
    });
  };

  const handleResolveFlags = () => {
    confirm({
      heading: t("modals.resolve_flags"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await resolveFlags(comment.id);
        closeDialog();
        revalidate();
      }
    });
  };

  const { attributes, relationships } = comment;

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
  } = attributes;

  const { creator, flags } = relationships;

  /* eslint-disable no-nested-ternary */
  const viewProps =
    subjectType === "Resource"
      ? !!projectSlug && !!subjectId
        ? {
            path: `/projects/${projectSlug}/resource/${subjectId}`
          }
        : null
      : !!subjectTextSlug && !!subjectTextSectionId
      ? {
          path: `/read/${subjectTextSlug}/section/${subjectTextSectionId}#annotation-${subjectId}`
        }
      : null;

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <section>
        <Layout.DrawerHeader
          title={t("records.comments.detail_header")}
          buttons={[
            {
              label: viewProps
                ? "actions.view"
                : "records.comments.view_unavailable",
              icon: viewProps ? "eyeOpen32" : "eyeClosed32",
              disabled: !viewProps,
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
        <Metadata
          creator={creator}
          createdAt={createdAt}
          subjectTitle={subjectTitle}
          textTitle={subjectTextTitle}
          isComment
        />
      </section>
    </>
  );
}
