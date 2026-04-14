import { useTranslation } from "react-i18next";
import { useFetcher, useNavigate } from "react-router";
import { exportTargetsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import Dialog from "components/global/dialog";
import ExportTargetForm from "components/backend/export-targets/Form";

export const handle = { drawer: true };

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => exportTargetsAPI.show(params.id),
    request
  });
};

export const action = formAction({
  mutation: ({ data, params }) => exportTargetsAPI.update(params.id, data)
});

export default function SettingsExportTargetsEdit({
  loaderData: exportTarget
}) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();

  const destroyExportTarget = useApiCallback(exportTargetsAPI.destroy);

  const handleExportTargetDestroy = () => {
    confirm({
      heading: t("modals.delete_export_target"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroyExportTarget(exportTarget?.id);
          navigate("/backend/settings/export-targets");
        } catch {
          closeDialog();
        }
      }
    });
  };

  return (
    <div>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Layout.DrawerHeader
        title={exportTarget.attributes.name}
        buttons={[
          {
            onClick: handleExportTargetDestroy,
            icon: "delete32",
            label: t("actions.delete"),
            className: "utility-button__icon--notice"
          }
        ]}
      />
      <ExportTargetForm fetcher={fetcher} model={exportTarget} />
    </div>
  );
}
