import { useTranslation } from "react-i18next";
import {
  useFetcher,
  useOutletContext,
  useNavigate,
  useParams
} from "react-router";
import { permissionsAPI } from "api";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import handleLoaderError from "app/routes/utility/helpers/handleLoaderError";
import handleActionError from "app/routes/utility/helpers/handleActionError";
import Layout from "backend/components/layout";
import Dialog from "global/components/dialog";
import PermissionForm from "backend/containers/permission/Form";
import { useApiCallback } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const handle = { drawer: true };

export const loader = async ({ params, context }) => {
  try {
    const entity = { type: "projects", id: params.id };
    const result = await queryApi(
      permissionsAPI.show(entity, params.permissionId),
      context
    );
    return { permission: result.data };
  } catch (error) {
    handleLoaderError(error);
  }
};

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

    return { success: true };
  } catch (error) {
    return handleActionError(error);
  }
}

export default function ProjectPermissionEdit({ loaderData }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { closeUrl } = useOutletContext();
  const { confirm, confirmation } = useConfirmation();
  const fetcher = useFetcher();

  const { permission } = loaderData;
  const destroyPermission = useApiCallback(permissionsAPI.destroy);

  const handleRemoveAll = () => {
    confirm({
      heading: t("modals.delete_permissions"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        const entity = { type: "projects", id };
        await destroyPermission(entity, permission.id);
        closeDialog();
        navigate(closeUrl);
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
