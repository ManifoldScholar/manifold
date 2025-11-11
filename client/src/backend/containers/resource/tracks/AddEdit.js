import { useTranslation } from "react-i18next";
import { useOutletContext, useParams } from "react-router-dom";
import textTracksAPI from "api/resources/textTracks";
import Layout from "backend/components/layout";
import AddEditForm from "backend/components/resource/tracks/AddEditForm";
import { useFetch } from "hooks";

function ResourceTrackAddEdit() {
  const { t } = useTranslation();
  const { trackId: id } = useParams();
  const { resource, refresh } = useOutletContext();

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

ResourceTrackAddEdit.displayName = "Resource.Tracks.AddEdit";

export default ResourceTrackAddEdit;
