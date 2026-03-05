import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher, redirect } from "react-router";
import { exportTargetsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import ExportTargetForm from "backend/components/export-targets/Form";

export const handle = { drawer: true };

export async function action({ request, context }) {
  const data = await request.json();

  try {
    const result = await queryApi(exportTargetsAPI.create(data), context);

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/settings/export-targets/${result.data.id}`);
  } catch (error) {
    return handleActionError(error);
  }
}

export default function SettingsExportTargetsNew() {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  const defaultExportTarget = useMemo(
    () => ({
      attributes: {
        strategy: "sftp_key",
        configuration: {
          targetNameFormat: "%s.%e"
        }
      }
    }),
    []
  );

  return (
    <section>
      <Layout.DrawerHeader title={t("settings.export_targets.form_header")} />
      <ExportTargetForm fetcher={fetcher} model={defaultExportTarget} />
    </section>
  );
}
