import { Outlet, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { resourceCollectionsAPI } from "api";
import authorize from "app/routes/utility/loaders/authorize";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import HeadContent from "components/global/HeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getResourceCollectionBreadcrumbs } from "helpers/breadcrumbs";
import Dialog from "components/global/dialog";
import navigation from "helpers/navigation";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const loader = async ({ params, context, request }) => {
  const resourceCollection = await loadEntity({
    context,
    fetchFn: () => resourceCollectionsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: resourceCollection,
    ability: "update"
  });
  return resourceCollection;
};

export default function ResourceCollectionDetailLayout({
  loaderData: resourceCollection
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();

  const destroy = useApiCallback(resourceCollectionsAPI.destroy);

  const project = resourceCollection.relationships.project;

  const handleDelete = () => {
    confirm({
      heading: t("modals.delete_resource_collection"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await destroy(resourceCollection.id);
          addNotification({
            level: 0,
            id: `RESOURCE_COLLECTION_DESTROYED_${resourceCollection.id}`,
            heading: t("notifications.resource_collection_delete"),
            body: t("notifications.delete_entity_body", {
              title: resourceCollection.attributes.title
            }),
            expiration: 5000
          });
          navigate(`/backend/projects/${project.id}/resource-collections`);
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `RESOURCE_COLLECTION_DESTROY_FAILED_${resourceCollection.id}`,
            heading: t("notifications.delete_failure", {
              entity: resourceCollection.attributes.title
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
      path: `/projects/${project.attributes.slug}/resource-collection/${resourceCollection.attributes.slug}`,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      icon: "delete32",
      authorize: "delete",
      onClick: handleDelete
    }
  ];

  const secondaryLinks = navigation.resourceCollection(resourceCollection);
  const subpage = location.pathname.split("/")[5];

  const belongsToJournalIssue = project.attributes.isJournalIssue;

  const breadcrumbs = getResourceCollectionBreadcrumbs(
    resourceCollection,
    project,
    belongsToJournalIssue,
    t
  );

  const parentProps = {
    parentTitle: project.attributes.titleFormatted,
    parentSubtitle: project.attributes.subtitle,
    texts: resourceCollection.attributes.projectTextsNav,
    parentId: project.id
  };

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${
            resourceCollection.attributes.title
          } | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type="resourceCollection"
        backUrl={`/backend/projects/${project.id}/resource-collections`}
        backLabel={project.attributes.titlePlaintext}
        actions={utility}
        title={resourceCollection.attributes.title}
        secondaryLinks={secondaryLinks}
        icon="ResourceCollection64"
        {...parentProps}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={secondaryLinks}
            panel
            ariaLabel={t("resource_collections.settings")}
          />
        }
      >
        <Outlet context={resourceCollection} />
      </Layout.BackendPanel>
    </>
  );
}
