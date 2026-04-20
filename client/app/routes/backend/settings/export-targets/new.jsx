import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { exportTargetsAPI } from "api";
import formAction from "lib/react-router/helpers/formAction";
import Layout from "components/backend/layout";
import ExportTargetForm from "components/backend/export-targets/Form";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data }) => exportTargetsAPI.create(data),
  redirectTo: ({ result }) =>
    `/backend/settings/export-targets/${result.data.id}`
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
