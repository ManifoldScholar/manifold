import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import { useParams } from "react-router-dom";
import { useFetch, useApiCallback } from "hooks";
import { annotationsAPI } from "api";
import {
  FlagsList,
  Body,
  Metadata
} from "backend/components/annotation/detail";
import withConfirmation from "hoc/withConfirmation";

function AnnotationDetailContainer({ refresh, confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: annotation } = useFetch({
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
      });
  }, [id, confirm, deleteAnnotation, t, refresh]);

  const { attributes, relationships } = annotation ?? {};

  const {
    body,
    flagsCount,
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

  const handleUnflag = () => {};

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
          ...(flagsCount
            ? [
                {
                  label: "Clear all flags",
                  icon: "circleMinus24",
                  ability: "update",
                  entity: annotation,
                  onClick: handleUnflag
                }
              ]
            : [])
        ]}
      />
      {!!flagsCount && <FlagsList flags={flags} />}
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
