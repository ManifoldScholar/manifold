import { useTranslation } from "react-i18next";
import { useFetcher, useOutletContext } from "react-router";
import textTracksAPI from "api/resources/textTracks";
import Layout from "backend/components/layout";
import AddEditForm from "backend/components/resource/tracks/AddEditForm";
import formAction from "app/routes/utility/helpers/formAction";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => textTracksAPI.create(params.id, data),
  redirectTo: ({ params }) => `/backend/projects/resource/${params.id}/tracks`
});

export default function NewTrack() {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const resource = useOutletContext();

  return (
    <section>
      <Layout.DrawerHeader title={t("records.tracks.add_header")} />
      <AddEditForm resource={resource} fetcher={fetcher} />
    </section>
  );
}
