import { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useParams, useOutletContext } from "react-router-dom";
import Layout from "backend/components/layout";
import { useFetch, useApiCallback } from "hooks";
import { annotationsAPI } from "api";
import lh from "helpers/linkHandler";
import {
  FlagsList,
  Body,
  Metadata
} from "backend/components/annotation/detail";
import withConfirmation from "hoc/withConfirmation";

function AnnotationDetailContainer({
  confirm,
  refresh,
  refreshAnnotations,
  readingGroup: readingGroupProp
}) {
  const { t } = useTranslation();
  const { annotationId, id } = useParams();
  const navigate = useNavigate();
  const outletContext = useOutletContext() || {};

  // Get readingGroup from outlet context if available, otherwise use prop
  const readingGroup = outletContext.readingGroup || readingGroupProp;
  // Get refresh functions from outlet context if available, otherwise use props
  const refreshFromContext = outletContext.refresh;
  const refreshAnnotationsFromContext = outletContext.refreshAnnotations;

  // Use annotationId from route if available (v6 route), otherwise fall back to id (for other routes)
  const annotationIdParam = annotationId || id;

  const { data: annotation, refresh: refreshAnnotation } = useFetch({
    request: [annotationsAPI.show, annotationIdParam],
    condition: !!annotationIdParam
  });

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_annotation");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteAnnotation(annotationIdParam);

        if (readingGroup) {
          const refreshFn = refreshAnnotationsFromContext || refreshAnnotations;
          if (refreshFn) refreshFn();
          navigate(lh.link("backendReadingGroupAnnotations", readingGroup.id));
        } else {
          const refreshFn = refreshFromContext || refresh;
          if (refreshFn) refreshFn();
          navigate(lh.link("backendRecordsAnnotations"));
        }
      });
  }, [
    annotationIdParam,
    confirm,
    deleteAnnotation,
    t,
    navigate,
    refreshFromContext,
    refresh,
    readingGroup,
    refreshAnnotationsFromContext,
    refreshAnnotations
  ]);

  const { attributes, relationships } = annotation ?? {};

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
  } = attributes ?? {};

  const { creator, flags } = relationships ?? {};

  const metadataProps = {
    creator,
    createdAt,
    textTitle,
    readingGroupName
  };

  const resolveFlags = useApiCallback(annotationsAPI.resolveAllFlags);

  const handleResolveFlags = useCallback(() => {
    const heading = t("modals.resolve_flags");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await resolveFlags(annotationIdParam);
        refreshAnnotation();
      });
  }, [annotationIdParam, confirm, resolveFlags, t, refreshAnnotation]);

  const viewButton =
    !!textSlug && !!textSectionId
      ? {
          label: "actions.view",
          route: "readerSection",
          routeParams: [
            textSlug,
            textSectionId,
            `#annotation-${annotationIdParam}`
          ],
          icon: "eyeOpen32"
        }
      : {
          label: "records.comments.view_unavailable",
          icon: "eyeClosed32",
          disabled: true
        };

  return annotationIdParam ? (
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
      <Metadata {...metadataProps} />
    </section>
  ) : null;
}

export default withConfirmation(AnnotationDetailContainer);

AnnotationDetailContainer.displayName = "Annotations.AnnotationDetail";

AnnotationDetailContainer.propTypes = {
  refresh: PropTypes.func,
  refreshAnnotations: PropTypes.func,
  confirm: PropTypes.func.isRequired,
  readingGroup: PropTypes.object
};
