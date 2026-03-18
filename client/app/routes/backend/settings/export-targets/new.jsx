import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { exportTargetsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "backend/components/layout";
import ExportTargetForm from "backend/components/export-targets/Form";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data }) => exportTargetsAPI.create(data),
  redirectTo: ({ result }) => `/backend/settings/export-targets/${result.data.id}`
});

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
