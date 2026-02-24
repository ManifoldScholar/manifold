import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useOutletContext, useParams, useNavigate } from "react-router-dom";
import Form from "./Form";
import { permissionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { useFetch, useApiCallback } from "hooks";

const { flush } = entityStoreActions;

function PermissionEdit({ confirm }) {
  const { t } = useTranslation();
  const { permissionId } = useParams();
  const navigate = useNavigate();
  const { entity, closeUrl } = useOutletContext() || {};

  const { data: permission } = useFetch({
    request: [permissionsAPI.show, entity, permissionId],
    options: { requestKey: requests.bePermission },
    condition: !!entity && !!permissionId
  });

  const destroyPermission = useApiCallback(permissionsAPI.destroy, {
    requestKey: requests.bePermissionDestroy,
    removes: permission
  });

  useEffect(() => {
    return () => {
      flush(requests.bePermission);
    };
  }, []);

  const handleRemoveAll = useCallback(() => {
    if (!permission) return;
    const heading = t("modals.delete_permissions");
    const message = t("modals.confirm_body");
    confirm(heading, message, async () => {
      if (entity && permission) {
        await destroyPermission(entity, permission.id);
        if (closeUrl) {
          navigate(closeUrl);
        }
      }
    });
  }, [permission, entity, confirm, destroyPermission, navigate, closeUrl, t]);

  if (!permission || !entity) return null;

  return (
    <section>
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
      <Form permission={permission} showUserInput />
    </section>
  );
}

PermissionEdit.displayName = "Permission.Edit";

export default withConfirmation(PermissionEdit);
