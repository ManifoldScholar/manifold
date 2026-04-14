import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import textTracksAPI from "api/resources/textTracks";
import Layout from "components/backend/layout";
import AddEditForm from "components/backend/resource/tracks/AddEditForm";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import formAction from "app/routes/utility/helpers/formAction";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => textTracksAPI.show(params.id, params.trackId),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) =>
    textTracksAPI.update(params.id, params.trackId, data),
  redirectTo: ({ params }) => `/backend/projects/resource/${params.id}/tracks`
});

export default function EditTrack({ loaderData: track }) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const resource = useOutletContext();

  const trackTitle = track?.attributes
    ? track.attributes.label ??
      t(`records.tracks.kind_${track?.attributes.kind}`)
    : null;

  return (
    <section>
      <Layout.DrawerHeader
        title={t("records.tracks.edit_header", { title: trackTitle })}
      />
      <AddEditForm resource={resource} track={track} fetcher={fetcher} />
    </section>
  );
}
