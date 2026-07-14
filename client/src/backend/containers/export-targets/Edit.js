import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import withConfirmation from "hoc/withConfirmation";
import { exportTargetsAPI } from "api";
import { useFetch, useApiCallback } from "hooks";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import Form from "./Form";

function ExportTargetsEditContainer({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: exportTarget } = useFetch({
    request: [exportTargetsAPI.show, id],
    condition: !!id
  });

  const destroyExportTarget = useApiCallback(exportTargetsAPI.destroy, {
    removes: exportTarget
  });

  const handleExportTargetDestroy = () => {
    const heading = t("modals.delete_export_target");
    const message = t("modals.confirm_body");

    if (confirm) {
      confirm(heading, message, async () => {
        await destroyExportTarget(id);
        navigate(lh.link("backendSettingsExportTargets"));
      });
    }
  };

  if (!exportTarget) return null;
  const attr = exportTarget.attributes;

  return (
    <section>
      <Layout.DrawerHeader
        title={attr.name}
        buttons={[
          {
            onClick: handleExportTargetDestroy,
            icon: "delete32",
            label: t("actions.delete"),
            className: "utility-button__icon--notice"
          }
        ]}
      />
      <Form model={exportTarget} />
    </section>
  );
}

ExportTargetsEditContainer.displayName = "ExportTargets.Edit";

export default withConfirmation(ExportTargetsEditContainer);
