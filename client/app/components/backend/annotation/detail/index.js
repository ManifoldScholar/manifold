import { useTranslation } from "react-i18next";
import { useNavigate, useRevalidator } from "react-router";
import { annotationsAPI } from "api";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Layout from "components/backend/layout";
import Dialog from "components/global/dialog";
import { FlagsList, Body, Metadata } from "./parts";

export { FlagsList, Body, Metadata };

export default function AnnotationDetail({
  annotation,
  closeUrl,
  onDeleteSuccess
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { revalidate } = useRevalidator();
  const { confirm, confirmation } = useConfirmation();

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);
  const resolveFlags = useApiCallback(annotationsAPI.resolveAllFlags);

  const onDelete = () => {
    confirm({
      heading: t("modals.delete_annotation"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await deleteAnnotation(annotation.id);
        closeDialog();
        if (onDeleteSuccess) onDeleteSuccess();
        navigate(closeUrl);
      }
    });
  };

  const handleResolveFlags = () => {
    confirm({
      heading: t("modals.resolve_flags"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        await resolveFlags(annotation.id);
        closeDialog();
        revalidate();
      }
    });
  };

  const { attributes, relationships } = annotation;

  const {
    body,
    flagsCount,
    unresolvedFlagsCount,
    resolvedFlagsCount,
    createdAt,
    textTitle,
    textSlug,
    textSectionId,
    readingGroupName
  } = attributes;

  const { creator, flags } = relationships;

  const viewButton =
    !!textSlug && !!textSectionId
      ? {
          label: "actions.view",
          path: `/read/${textSlug}/section/${textSectionId}#annotation-${annotation.id}`,
          icon: "eyeOpen32"
        }
      : {
          label: "records.comments.view_unavailable",
          icon: "eyeClosed32",
          disabled: true
        };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <section>
        <Layout.DrawerHeader
          title={t("records.annotations.detail_header")}
          buttons={[
            viewButton,
            {
              label: t("actions.delete"),
              icon: "delete24",
              ability: "delete",
              entity: annotation,
              onClick: onDelete
            },
            ...(unresolvedFlagsCount
              ? [
                  {
                    label: t("records.annotations.resolve_all_label"),
                    icon: "circleMinus24",
                    ability: "update",
                    entity: annotation,
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
          textTitle={textTitle}
          readingGroupName={readingGroupName}
        />
      </section>
    </>
  );
}
