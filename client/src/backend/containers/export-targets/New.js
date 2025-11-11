import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import Form from "./Form";

export default function ExportTargetsNewContainer() {
  const { t } = useTranslation();
  const navigate = useNavigate();

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

  const redirectToExportTarget = exportTarget => {
    const path = lh.link("backendSettingsExportTargets", exportTarget.id);
    navigate(path, { state: { keepNotifications: true } });
  };

  return (
    <section>
      <Layout.DrawerHeader title={t("settings.export_targets.form_header")} />
      <Form
        model={defaultExportTarget}
        onSuccess={redirectToExportTarget}
        options={{ adds: requests.beExportTargets }}
      />
    </section>
  );
}

ExportTargetsNewContainer.displayName = "ExportTargets.New";
