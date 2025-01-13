import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useParams, useHistory } from "react-router-dom";
import { useFetch, useApiCallback } from "hooks";
import { annotationsAPI } from "api";
import lh from "helpers/linkHandler";
import {
  FlagsList,
  Body,
  Metadata
} from "backend/components/annotation/detail";
import withConfirmation from "hoc/withConfirmation";

function AnnotationDetailContainer({ refresh, confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const history = useHistory();

  const { data: annotation, refresh: refreshAnnotation } = useFetch({
    request: [annotationsAPI.show, id],
    condition: !!id
  });

  const deleteAnnotation = useApiCallback(annotationsAPI.destroy);

  const onDelete = useCallback(() => {
    const heading = t("modals.delete_annotation");
    const message = t("modals.confirm_body");
    if (confirm)
      confirm(heading, message, async () => {
        await deleteAnnotation(id);
        refresh();
        history.push(lh.link("backendRecordsAnnotations"));
      });
  }, [id, confirm, deleteAnnotation, t, history, refresh]);

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
        await resolveFlags(id);
        refreshAnnotation();
      });
  }, [id, confirm, resolveFlags, t, refreshAnnotation]);

  return id ? (
    <section>
      <Layout.DrawerHeader
        title={t("records.annotations.detail_header")}
        buttons={[
          {
            label: "actions.view",
            route: "readerSection",
            routeParams: [textSlug, textSectionId, `#annotation-${id}`],
            icon: "eyeOpen32"
          },
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
  refresh: PropTypes.func.isRequired,
  confirm: PropTypes.func.isRequired
};
