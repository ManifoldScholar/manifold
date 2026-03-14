import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useOutletContext,
  useNavigate,
  useParams,
  redirect
} from "react-router";
import { permissionsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import Dialog from "global/components/dialog";
import PermissionForm from "backend/components/permission/Form";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const handle = { drawer: true };

export async function action({ request, context, params }) {
  const data = await request.json();
  const entity = { type: "projects", id: params.id };

  try {
    const result = await queryApi(
      permissionsAPI.update(entity, params.permissionId, data),
      context
    );

    if (result?.errors) {
      return { errors: result.errors };
    }

    throw redirect(`/backend/projects/${params.id}/access/`);
  } catch (error) {
    return handleActionError(error);
  }
}

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
