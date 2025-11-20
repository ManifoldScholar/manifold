import { useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "backend/components/layout";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import withConfirmation from "hoc/withConfirmation";
import { userGroupsAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
// import Authorize from "hoc/Authorize";
import {
  // useFetch,
  useApiCallback,
  useNotification,
  useRedirectToFirstMatch
} from "hooks";

function UserGroupWrapper({ route, history, confirm, location }) {
  const { t } = useTranslation();
  const { id } = useParams();

  // const { data: userGroup, refresh } = useFetch({
  //   request: [userGroupsAPI.show, id]
  // });

  const userGroup = useMemo(
    () => ({
      id: "test",
      type: "userGroups",
      attributes: { name: "Test User Group", externalId: "test-group-1" }
    }),
    []
  );
  const refresh = () => {};

  const destroy = useApiCallback(userGroupsAPI.destroy, {
    removes: userGroup
  });

  const notifyDestroy = useNotification(ug => ({
    level: 0,
    id: `USER_GROUP_DESTROYED_${ug.id}`,
    heading: t("notifications.user_group_delete", {
      name: ug.attributes.name || ug.id
    }),
    expiration: 5000
  }));

  const destroyAndRedirect = useCallback(() => {
    const redirect = () => history.push(lh.link("backendRecordsUserGroups"));
    destroy(userGroup.id).then(
      () => {
        notifyDestroy(userGroup);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, history, userGroup, notifyDestroy]);

  const handleUserGroupDestroy = useCallback(() => {
    const heading = t("modals.delete_user_group");
    const message = t("modals.confirm_body");
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm, t]);

  const utility = [
    {
      label: "actions.delete",
      // authorize: "delete",
      icon: "delete32",
      onClick: handleUserGroupDestroy
    }
  ];

  const renderRoutes = () => {
    return childRoutes(route, {
      childProps: { refresh, userGroup }
    });
  };

  useRedirectToFirstMatch({
    route: "backendRecordsUserGroup",
    id: userGroup?.id,
    candidates: userGroup ? navigation.userGroup(userGroup) : []
  });

  if (!userGroup || id === "new") return null;

  const subpage = location.pathname.split("/")[5]?.replace("-", "_");

  return (
    <div>
      {/* <Authorize
        entity={userGroup}
        failureFatalError={{
          detail: t("groups.unauthorized_edit")
        }}
        ability={["update"]}
      > */}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${userGroup.attributes.name ||
            t("glossary.user_group_title_case_one")} | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <PageHeader
        type="userGroup"
        icon="Privacy24"
        title={userGroup.attributes.name || userGroup.id}
        actions={utility}
        secondaryLinks={navigation.userGroup(userGroup)}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={navigation.userGroup(userGroup)}
            panel
            ariaLabel={t("records.user_groups.settings")}
          />
        }
      >
        <div>{renderRoutes()}</div>
      </Layout.BackendPanel>
      {/* </Authorize> */}
    </div>
  );
}

export default withConfirmation(UserGroupWrapper);
