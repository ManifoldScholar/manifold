import { Outlet, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { userGroupsAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import HeadContent from "components/global/HeadContent";
import Dialog from "components/global/dialog";
import navigation from "helpers/navigation";
import { useApiCallback, useConfirmation, useNotifications } from "hooks";

export const loader = async ({ params, context, url }) => {
  const userGroup = await loadEntity({
    context,
    fetchFn: () => userGroupsAPI.show(params.id),
    url
  });
  return userGroup;
};

export default function UserGroupDetailLayout({ loaderData: userGroup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(userGroupsAPI.destroy, {
    removes: userGroup
  });

  const handleDestroy = () => {
    confirm({
      heading: t("modals.delete_user_group"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(userGroup.id);
          addNotification({
            level: 0,
            id: `USER_GROUP_DESTROYED_${userGroup.id}`,
            heading: t("notifications.user_group_delete", {
              name: userGroup.attributes.name || userGroup.id
            }),
            expiration: 5000
          });
        } finally {
          closeDialog();
          navigate("/backend/records/user-groups");
        }
      }
    });
  };

  const utility = [
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleDestroy
    }
  ];

  const subpage = location.pathname.split("/")[5]?.replace("-", "_");
  const title = userGroup.attributes.name || userGroup.id;

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${userGroup.attributes.name ||
            t("glossary.user_group_title_case_one")} | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <PageHeader
        type="userGroup"
        icon="Users32"
        title={title}
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
        <div>
          <Outlet context={{ userGroup }} />
        </div>
      </Layout.BackendPanel>
    </>
  );
}
