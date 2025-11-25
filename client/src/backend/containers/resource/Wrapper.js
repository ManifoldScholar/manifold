import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "backend/components/layout";
import { notificationActions } from "actions";
import { resourcesAPI } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import { useFetch, useApiCallback } from "hooks";

import Authorize from "hoc/Authorize";

function ResourceWrapperContainer({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: resource, refresh } = useFetch({
    request: [resourcesAPI.show, id]
  });

  const destroy = useApiCallback(resourcesAPI.destroy);

  const notifyDestroy = useCallback(() => {
    const notification = {
      level: 0,
      id: `RESOURCE_DESTROYED_${resource.id}`,
      heading: t("notifications.resource_delete"),
      body: t("notifications.delete_entity_body", {
        title: resource.attributes.title
      }),
      expiration: 5000
    };
    dispatch(notificationActions.addNotification(notification));
  }, [dispatch, resource, t]);

  const redirectToProjectResources = useCallback(() => {
    const projectId = resource.relationships.project.id;
    const redirectUrl = lh.link("backendProjectResources", projectId);
    navigate(redirectUrl);
  }, [navigate, resource]);

  const doDestroy = useCallback(async () => {
    await destroy(resource.id);
    notifyDestroy();
    redirectToProjectResources();
  }, [destroy, resource, notifyDestroy, redirectToProjectResources]);

  const handleResourceDestroy = useCallback(() => {
    const heading = t("modals.delete_resource");
    const message = t("modals.confirm_body");
    confirm(heading, message, doDestroy);
  }, [confirm, doDestroy, t]);

  const utility = useMemo(() => {
    if (!resource) return [];
    const { project } = resource.relationships ?? {};

    return [
      {
        label: "actions.view",
        route: "frontendProjectResource",
        slug: project.attributes.slug,
        resourceSlug: resource.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        icon: "delete32",
        authorize: "delete",
        onClick: handleResourceDestroy
      }
    ];
  }, [resource, handleResourceDestroy]);

  if (!resource) return null;

  const secondaryLinks = navigation.resource(resource);
  const subpage = location.pathname.split("/")[5];

  const belongsToJournalIssue =
    resource.relationships.project.attributes.isJournalIssue;

  const breadcrumbs = getBreadcrumbs(
    resource,
    resource.relationships.project,
    belongsToJournalIssue,
    t
  );

  const parentProps = {
    parentTitle: resource.relationships.project.attributes.titleFormatted,
    parentSubtitle: resource.relationships.project.attributes.subtitle,
    texts: resource.attributes.projectTextsNav,
    parentId: resource.relationships.project.id
  };

  return (
    <div>
      <Authorize
        entity={resource}
        failureNotification={{
          body: t("resources.unauthorized")
        }}
        failureRedirect
        ability="update"
      >
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
          <div>
            <Outlet context={{ resource, refresh }} />
          </div>
        </Layout.BackendPanel>
      </Authorize>
    </div>
  );
}

ResourceWrapperContainer.displayName = "Resource.Wrapper";

export default withConfirmation(ResourceWrapperContainer);
