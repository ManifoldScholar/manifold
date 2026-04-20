import { Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { readingGroupsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import HeadContent from "components/global/HeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import Dialog from "components/global/dialog";
import navigation from "helpers/router/navigation";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import { capitalize } from "lodash-es";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => readingGroupsAPI.show(params.id),
    request
  });
};

export default function GroupDetailLayout({ loaderData: readingGroup }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(readingGroupsAPI.destroy, {
    removes: readingGroup
  });

  const handleDelete = () => {
    confirm({
      heading: t("modals.delete_reading_group"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(readingGroup.id);
          addNotification({
            level: 0,
            id: `READING_GROUP_DESTROYED_${readingGroup.id}`,
            heading: t("notifications.reading_group_delete"),
            body: t("notifications.delete_entity_body", {
              title: readingGroup?.attributes?.name
            }),
            expiration: 5000
          });
          navigate("/backend/groups");
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `READING_GROUP_DESTROY_FAILED_${readingGroup.id}`,
            heading: t("notifications.delete_failure", {
              entity: readingGroup.attributes.name
            }),
            body: t("notifications.delete_failure_body"),
            expiration: 5000
          });
        }
      }
    });
  };

  const utility = [
    {
      label: "actions.view",
      path: `/groups/${readingGroup.id}`,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleDelete
    }
  ];

  const breadcrumbs = [
    {
      to: "/backend/groups",
      label: t("glossary.reading_group_title_case_other")
    },
    {
      to: `/backend/groups/${readingGroup.id}`,
      label: readingGroup.attributes.name
    }
  ];

  return (
    <main id="skip-to-main" tabIndex={-1} className="backend-detail">
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <HeadContent
        title={`${readingGroup.attributes.name} | ${t("common.admin")}`}
        appendDefaultTitle
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <PageHeader
        type="readingGroup"
        icon="ReadingGroup24"
        title={readingGroup.attributes.name}
        subtitle={`${capitalize(readingGroup.attributes.privacy)} Group`}
        actions={utility}
        secondaryLinks={navigation.readingGroup(readingGroup)}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={navigation.readingGroup(readingGroup)}
            panel
            ariaLabel={t("readingGroups.settings")}
          />
        }
      >
        <div>
          <Outlet context={{ readingGroup }} />
        </div>
      </Layout.BackendPanel>
    </main>
  );
}
