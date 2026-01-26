import { useCallback, useState } from "react";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { usersAPI } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import { useFetch, useApiCallback, useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import Dialog from "global/components/dialog";

function UserWrapper({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [passwordModalOpen, toggleOpen] = useState(false);
  const [passwordModalProps, setModalProps] = useState(null);

  const { data: user, refresh } = useFetch({
    request: [usersAPI.show, id],
    condition: !!id
  });

  const destroy = useApiCallback(usersAPI.destroy, {
    removes: user
  });

  const update = useApiCallback(usersAPI.update);

  const notifyDestroy = useNotification(u => ({
    level: 0,
    id: `USER_DESTROYED_${u.id}`,
    heading: t("notifications.user_delete", { name: u.attributes.fullName }),
    expiration: 5000
  }));

  const destroyAndRedirect = useCallback(async () => {
    const redirect = () => navigate(lh.link("backendRecordsUsers"));
    try {
      await destroy(user.id);
      notifyDestroy(user);
      redirect();
    } catch {
      redirect();
    }
  }, [destroy, navigate, user, notifyDestroy]);

  const handleUserDestroy = useCallback(() => {
    const heading = t("modals.delete_user");
    const message = t("modals.confirm_body");
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm, t]);

  const handleResetPasswordClick = () => {
    new Promise((resolve, reject) => {
      setModalProps({
        resolve,
        reject
      });
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
    const adjustedUser = { ...user };
    adjustedUser.attributes.adminVerified = !verified;
    confirm(heading, message, () => update(id, adjustedUser));
  };

  const unsubscribeUser = () => {
    const heading = t("modals.unsubscribe");
    const message = t("modals.unsubscribe_body");
    const adjustedUser = { ...user };
    adjustedUser.attributes.unsubscribe = true;
    confirm(heading, message, () => update(id, adjustedUser));
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

  if (!user) return null;

  const subpage = location.pathname.split("/")[5]?.replace("-", "_");

  return (
    <div>
      <Authorize
        entity={user}
        failureNotification={{
          body: t("groups.unauthorized_edit")
        }}
        failureRedirect
        ability={["update"]}
      >
        {subpage && (
          <HeadContent
            title={`${t(`titles.${subpage}`)} | ${
              user.attributes.fullName
            } | ${t("common.admin")}`}
            appendDefaultTitle
          />
        )}
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
            <Outlet context={{ refresh, user }} />
          </div>
        </Layout.BackendPanel>
      </Authorize>
      {passwordModalOpen ? (
        <Dialog.ResetPassword user={user} {...passwordModalProps} />
      ) : null}
    </div>
  );
}

export default withConfirmation(UserWrapper);
