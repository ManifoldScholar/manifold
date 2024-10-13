import React, { useCallback } from "react";
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
import capitalize from "lodash/capitalize";

function UserWrapper({ match, route, history, confirm, location }) {
  const { t } = useTranslation();
  const { data: user, refresh } = useFetch({
    request: [usersAPI.show, match.params.id]
  });
  const destroy = useApiCallback(usersAPI.destroy, {
    removes: user
  });

  const notifyDestroy = useNotification(u => ({
    level: 0,
    id: `USER_DESTROYED_${u.id}`,
    heading: t("notifications.reading_group_delete"),
    body: t("notifications.delete_entity_body", {
      title: u?.name
    }),
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

  const utility = [
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

  if (!user) return null;

  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

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
            title={`${t(`titles.${subpage}`)} | ${user.attributes.name} | ${t(
              "common.admin"
            )}`}
            appendDefaultTitle
          />
        )}
        <PageHeader
          type="user"
          icon="Avatar24"
          title={user.attributes.fullName}
          subtitle={capitalize(user.attributes.role)}
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
          <div>{renderRoutes()}</div>
        </Layout.BackendPanel>
      </Authorize>
    </div>
  );
}

export default withConfirmation(UserWrapper);
