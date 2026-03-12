import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { journalVolumesAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Volume from "backend/components/volume";
import Layout from "backend/components/layout";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();

  try {
    const result = await queryApi(
      journalVolumesAPI.create(params.id, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/journals/${params.id}/volumes`);
  } catch (error) {
    return handleActionError(error);
  }
}

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
