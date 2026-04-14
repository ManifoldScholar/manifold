import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { journalVolumesAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Volume from "components/backend/volume";
import Layout from "components/backend/layout";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) => journalVolumesAPI.create(params.id, data),
  redirectTo: ({ params }) => `/backend/journals/${params.id}/volumes`
});

export default function JournalVolumeNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <section>
      <Layout.DrawerHeader title={t("volumes.create_header")} />
      <Volume.Form fetcher={fetcher} />
    </section>
  );
}
