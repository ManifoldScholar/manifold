import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import textTracksAPI from "api/resources/textTracks";
import Layout from "backend/components/layout";
import AddEditForm from "backend/components/resource/tracks/AddEditForm";
import { useParams } from "react-router-dom";
import { useFetch } from "hooks";

export default function ResourceTrackAddEdit({ resource, refresh }) {
  const { t } = useTranslation();
  const { trackId: id } = useParams();

  const { data: track } = useFetch({
    request: [textTracksAPI.show, resource.id, id],
    condition: !!id
  });

  const trackTitle = track?.attributes
    ? track.attributes.label ??
      t(`records.tracks.kind_${track?.attributes.kind}`)
    : null;

  return (
    <section>
      <Layout.DrawerHeader
        title={
          id
            ? t("records.tracks.edit_header", {
                title: trackTitle
              })
            : t("records.tracks.add_header")
        }
      />
      <AddEditForm resource={resource} track={track} refresh={refresh} />
    </section>
  );
}

ResourceTrackAddEdit.propTypes = {
  resource: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object,
  refresh: PropTypes.func
};
