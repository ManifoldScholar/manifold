import { Outlet, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { resourcesAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "backend/components/layout";
import PageHeader from "backend/components/layout/PageHeader";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getResourceBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import Dialog from "global/components/dialog";
import navigation from "helpers/router/navigation";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const loader = async ({ params, context, request }) => {
  const resource = await loadEntity({
    context,
    fetchFn: () => resourcesAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: resource,
    ability: "update"
  });
  return resource;
};

export default function ResourceDetailLayout({ loaderData: resource }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(resourcesAPI.destroy);

  const project = resource.relationships.project;

  const handleDelete = () => {
    confirm({
      heading: t("modals.delete_resource"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(resource.id);
          addNotification({
            level: 0,
            id: `RESOURCE_DESTROYED_${resource.id}`,
            heading: t("notifications.resource_delete"),
            body: t("notifications.delete_entity_body", {
              title: resource.attributes.title
            }),
            expiration: 5000
          });
          navigate(`/backend/projects/${project.id}/resources`);
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `RESOURCE_DESTROY_FAILED_${resource.id}`,
            heading: t("notifications.delete_failure", {
              entity: resource.attributes.title
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
      path: `/projects/${project.attributes.slug}/resource/${resource.attributes.slug}`,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      icon: "delete32",
      authorize: "delete",
      onClick: handleDelete
    }
  ];

  const secondaryLinks = navigation.resource(resource);
  const subpage = location.pathname.split("/")[5];

  const belongsToJournalIssue = project.attributes.isJournalIssue;

  const breadcrumbs = getResourceBreadcrumbs(
    resource,
    project,
    belongsToJournalIssue,
    t
  );

  const parentProps = {
    parentTitle: project.attributes.titleFormatted,
    parentSubtitle: project.attributes.subtitle,
    texts: resource.attributes.projectTextsNav,
    parentId: project.id
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${
            resource.attributes.titlePlaintext
          } | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="resource"
        actions={utility}
        title={resource.attributes.titleFormatted}
        subtitle={resource.attributes.subtitle}
        secondaryLinks={secondaryLinks}
        icon="BEResourcesBox64"
        {...parentProps}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={secondaryLinks}
            panel
            ariaLabel={t("resources.settings")}
          />
        }
      >
        <Outlet context={resource} />
      </Layout.BackendPanel>
    </>
  );
}
