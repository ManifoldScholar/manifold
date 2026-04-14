import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { usersAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import Dialog from "global/components/dialog";
import navigation from "helpers/router/navigation";
import { useApiCallback, useConfirmation, useNotifications } from "hooks";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => usersAPI.show(params.id),
    request
  });
};

export default function UserDetailLayout({ loaderData: user }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const [passwordModalOpen, toggleOpen] = useState(false);
  const [passwordModalProps, setModalProps] = useState(null);

  const destroy = useApiCallback(usersAPI.destroy, { removes: user });
  const update = useApiCallback(usersAPI.update);

  const handleUserDestroy = () => {
    confirm({
      heading: t("modals.delete_user"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(user.id);
          addNotification({
            level: 0,
            id: `USER_DESTROYED_${user.id}`,
            heading: t("notifications.user_delete", {
              name: user.attributes.fullName
            }),
            expiration: 5000
          });
          closeDialog();
          navigate("/backend/records/users");
        } catch {
          closeDialog();
          navigate("/backend/records/users");
        }
      }
    });
  };

  const handleResetPasswordClick = () => {
    new Promise((resolve, reject) => {
      setModalProps({ resolve, reject });
      toggleOpen(true);
    }).then(
      () => toggleOpen(false),
      () => toggleOpen(false)
    );
  };

  const verifyUser = () => {
    const verified = user.attributes.adminVerified;
    const heading = verified ? t("modals.unverify") : t("modals.verify");
    const message = verified
      ? t("modals.unverify_body")
      : t("modals.verify_body");
    confirm({
      heading,
      message,
      callback: async closeDialog => {
        const adjustedUser = {
          ...user,
          attributes: { ...user.attributes, adminVerified: !verified }
        };
        await update(user.id, adjustedUser);
        closeDialog();
      }
    });
  };

  const unsubscribeUser = () => {
    confirm({
      heading: t("modals.unsubscribe"),
      message: t("modals.unsubscribe_body"),
      callback: async closeDialog => {
        const adjustedUser = {
          ...user,
          attributes: { ...user.attributes, unsubscribe: true }
        };
        await update(user.id, adjustedUser);
        closeDialog();
      }
    });
  };

  const utility = [
    {
      onClick: verifyUser,
      icon: "privacy24",
      label: user?.attributes.adminVerified
        ? t("records.users.block")
        : t("records.users.verify")
    },
    {
      onClick: unsubscribeUser,
      icon: "mail32",
      label: t("records.users.unsubscribe")
    },
    {
      onClick: handleResetPasswordClick,
      icon: "key32",
      label: t("records.users.reset_password")
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleUserDestroy
    }
  ];

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <PageHeader
        type="user"
        icon="Avatar24"
        title={user.attributes.fullName}
        subtitle={t(`records.users.role_options.${user.attributes.role}`)}
        actions={utility}
        secondaryLinks={navigation.user(user)}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={navigation.user(user)}
            panel
            ariaLabel={t("users.settings")}
          />
        }
      >
        <div>
          <Outlet context={{ user }} />
        </div>
      </Layout.BackendPanel>
      {passwordModalOpen ? (
        <Dialog.ResetPassword user={user} {...passwordModalProps} />
      ) : null}
    </>
  );
}
