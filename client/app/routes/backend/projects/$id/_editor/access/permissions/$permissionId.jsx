import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useOutletContext,
  useNavigate,
  useParams
} from "react-router";
import { permissionsAPI } from "api";
import formAction from "app/routes/utility/helpers/formAction";
import Layout from "components/backend/layout";
import Dialog from "components/global/dialog";
import PermissionForm from "components/backend/permission/Form";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const handle = { drawer: true };

export const action = formAction({
  mutation: ({ data, params }) =>
    permissionsAPI.update(
      { type: "projects", id: params.id },
      params.permissionId,
      data
    ),
  redirectTo: ({ params }) => `/backend/projects/${params.id}/access/`
});

export default function ProjectPermissionEdit() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id, permissionId } = useParams();
  const { confirm, confirmation } = useConfirmation();
  const fetcher = useFetcher();

  // User data is included on permissionsAPI.index but not show
  // All data needed for this drawer was already fetched in the layout
  const permissions = useOutletContext();
  const permission = permissions.find(p => p.id === permissionId);

  const destroyPermission = useApiCallback(permissionsAPI.destroy);

  const handleRemoveAll = () => {
    confirm({
      heading: t("modals.delete_permissions"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        const entity = { type: "projects", id };
        await destroyPermission(entity, permission.id);
        closeDialog();
        navigate(`/backend/projects/${id}/access`);
      }
    });
  };

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <Layout.DrawerHeader
        title={t("projects.permissions.edit_header")}
        buttons={[
          {
            onClick: handleRemoveAll,
            icon: "delete32",
            label: t("actions.delete"),
            className: "utility-button__icon--notice"
          }
        ]}
      />
      <PermissionForm fetcher={fetcher} permission={permission} showUserInput />
    </section>
  );
}
