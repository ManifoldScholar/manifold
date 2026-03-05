import { useTranslation } from "react-i18next";
import { useNavigate, useRevalidator } from "react-router";
import { annotationsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Layout from "backend/components/layout";
import Dialog from "global/components/dialog";
import lh from "helpers/linkHandler";
import {
  FlagsList,
  Body,
  Metadata
} from "backend/components/annotation/detail";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => annotationsAPI.show(params.id),
    request
  });
};

export default function AnnotationDetail({ loaderData: annotation }) {
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
        navigate("/backend/records/annotations");
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
          path: lh.link(
            "readerSection",
            textSlug,
            textSectionId,
            `#annotation-${annotation.id}`
          ),
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
