import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "backend/components/layout";
import { notificationActions } from "actions";
import { resourceCollectionsAPI, projectsAPI } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import { useFetch, useApiCallback } from "hooks";

import Authorize from "hoc/Authorize";

function ResourceCollectionWrapperContainer({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: resourceCollection, refresh } = useFetch({
    request: [resourceCollectionsAPI.show, id]
  });

  const projectId = resourceCollection?.attributes?.projectId;

  const { data: project } = useFetch({
    request: [projectsAPI.show, projectId],
    condition: !!projectId
  });

  const destroy = useApiCallback(resourceCollectionsAPI.destroy);

  const notifyDestroy = useCallback(() => {
    const notification = {
      level: 0,
      id: `RESOURCE_COLLECTION_DESTROYED_${resourceCollection.id}`,
      heading: t("notifications.resource_collection_delete"),
      body: t("notifications.delete_entity_body", {
        title: resourceCollection.attributes.title
      }),
      expiration: 5000
    };
    dispatch(notificationActions.addNotification(notification));
  }, [dispatch, resourceCollection, t]);

  const redirectToProjectCollections = useCallback(() => {
    const projId = resourceCollection.relationships.project.id;
    const redirectUrl = lh.link("backendProjectResourceCollections", projId);
    navigate(redirectUrl);
  }, [navigate, resourceCollection]);

  const doDestroy = useCallback(async () => {
    await destroy(resourceCollection.id);
    notifyDestroy();
    redirectToProjectCollections();
  }, [
    destroy,
    resourceCollection,
    notifyDestroy,
    redirectToProjectCollections
  ]);

  const handleCollectionDestroy = useCallback(() => {
    const heading = t("modals.delete_resource_collection");
    const message = t("modals.confirm_body");
    confirm(heading, message, doDestroy);
  }, [confirm, doDestroy, t]);

  const utility = useMemo(() => {
    if (!resourceCollection) return [];
    return [
      {
        label: "actions.view",
        route: "frontendProjectResourceCollection",
        slug: resourceCollection.relationships.project.attributes.slug,
        resourceSlug: resourceCollection.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        icon: "delete32",
        authorize: "delete",
        onClick: handleCollectionDestroy
      }
    ];
  }, [resourceCollection, handleCollectionDestroy]);

  if (!resourceCollection) return null;

  const secondaryLinks = navigation.resourceCollection(resourceCollection);
  const subpage = location.pathname.split("/")[5];

  const belongsToJournalIssue =
    resourceCollection.relationships.project.attributes.isJournalIssue;

  const breadcrumbs = getBreadcrumbs(
    resourceCollection,
    resourceCollection.relationships.project,
    belongsToJournalIssue,
    t
  );

  const parentProps = {
    parentTitle:
      resourceCollection.relationships.project.attributes.titleFormatted,
    parentSubtitle:
      resourceCollection.relationships.project.attributes.subtitle,
    texts: resourceCollection.attributes.projectTextsNav,
    parentId: resourceCollection.relationships.project.id
  };

  return (
    <div>
      <Authorize
        entity={resourceCollection}
        failureNotification={{
          body: t("resource_collections.unauthorized")
        }}
        failureRedirect
        ability="update"
      >
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
          backUrl={lh.link(
            "backendProjectResourceCollections",
            resourceCollection.relationships.project.id
          )}
          backLabel={
            resourceCollection.relationships.project.attributes.titlePlaintext
          }
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
          <div>
            <Outlet context={{ resourceCollection, project, refresh }} />
          </div>
        </Layout.BackendPanel>
      </Authorize>
    </div>
  );
}

ResourceCollectionWrapperContainer.displayName = "ResourceCollection.Wrapper";

export default withConfirmation(ResourceCollectionWrapperContainer);
