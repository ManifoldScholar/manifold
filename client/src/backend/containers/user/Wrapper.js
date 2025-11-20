import React, { useCallback, useState } from "react";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { usersAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import {
  useFetch,
  useApiCallback,
  useNotification,
  useRedirectToFirstMatch
} from "hooks";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import Dialog from "global/components/dialog";
import UserNew from "./New";

function UserWrapper({ match, route, history, confirm, location }) {
  const { t } = useTranslation();

  const id = match.params.id;

  const [passwordModalOpen, toggleOpen] = useState(false);
  const [passwordModalProps, setModalProps] = useState(null);

  const { data: user, refresh } = useFetch({
    request: [usersAPI.show, id],
    condition: id !== "new"
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

  const destroyAndRedirect = useCallback(() => {
    const redirect = () => history.push(lh.link("backendRecordsUsers"));
    destroy(user.id).then(
      () => {
        notifyDestroy(user);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, history, user, notifyDestroy]);

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

  const renderRoutes = () => {
    return childRoutes(route, {
      childProps: { refresh, user }
    });
  };

  useRedirectToFirstMatch({
    route: "backendRecordsUser",
    id: user?.id,
    slug: user?.attributes.slug,
    candidates: user ? navigation.user(user) : []
  });

  if (id === "new") return <UserNew />;

  if (!user) return null;

  const subpage = location.pathname.split("/")[5]?.replace("-", "_");

  return (
    <div>
      <Authorize
        entity={user}
        failureFatalError={{
          detail: t("groups.unauthorized_edit")
        }}
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
              ariaLabel={t("records.users.settings")}
            />
          }
        >
          <div>{renderRoutes()}</div>
        </Layout.BackendPanel>
      </Authorize>
      {passwordModalOpen ? (
        <Dialog.ResetPassword user={user} {...passwordModalProps} />
      ) : null}
    </div>
  );
}

export default withConfirmation(UserWrapper);
