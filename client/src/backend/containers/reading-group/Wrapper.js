import React, { useCallback } from "react";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { readingGroupsAPI } from "api";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import {
  useFetch,
  useApiCallback,
  useNotification,
  useRedirectToFirstMatch,
} from "hooks";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import capitalize from "lodash/capitalize";

function ReadingGroupWrapper({ match, route, history, confirm, location }) {
  const { t } = useTranslation();
  const { data: readingGroup, refresh } = useFetch({
    request: [readingGroupsAPI.show, match.params.id],
  });
  const destroy = useApiCallback(readingGroupsAPI.destroy, {
    removes: readingGroup,
  });

  const notifyDestroy = useNotification((rg) => ({
    level: 0,
    id: `READING_GROUP_DESTROYED_${rg.id}`,
    heading: t("notifications.reading_group_delete"),
    body: t("notifications.delete_entity_body", {
      title: rg?.name,
    }),
    expiration: 5000,
  }));

  const destroyAndRedirect = useCallback(() => {
    const redirect = () => history.push(lh.link("backendReadingGroups"));
    destroy(readingGroup.id).then(
      () => {
        notifyDestroy(readingGroup);
        redirect();
      },
      () => redirect(),
    );
  }, [destroy, history, readingGroup, notifyDestroy]);

  const handleReadingGroupDestroy = useCallback(() => {
    const heading = t("modals.delete_reading_group");
    const message = t("modals.confirm_body");
    confirm(heading, message, destroyAndRedirect);
  }, [destroyAndRedirect, confirm, t]);

  const utility = [
    {
      label: "actions.view",
      route: "frontendReadingGroupDetail",
      slug: readingGroup?.id,
      icon: "eyeOpen32",
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleReadingGroupDestroy,
    },
  ];

  const renderRoutes = () => {
    return childRoutes(route, {
      childProps: { refresh, readingGroup },
    });
  };

  useRedirectToFirstMatch({
    route: "backendReadingGroup",
    id: readingGroup?.id,
    slug: readingGroup?.attributes.slug,
    candidates: readingGroup ? navigation.readingGroup(readingGroup) : [],
  });

  if (!readingGroup) return null;

  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

  const breadcrumbs = [
    {
      to: lh.link("backendReadingGroups"),
      label: t("glossary.reading_group_title_case_other"),
    },
    {
      to: lh.link("backendReadingGroup", readingGroup.id),
      label: readingGroup.attributes.name,
    },
  ];

  return (
    <div>
      <Authorize
        entity={readingGroup}
        failureFatalError={{
          detail: t("groups.unauthorized_edit"),
        }}
        ability={["update"]}
      >
        {subpage && (
          <HeadContent
            title={`${t(`titles.${subpage}`)} | ${
              readingGroup.attributes.name
            } | ${t("common.admin")}`}
            appendDefaultTitle
          />
        )}
        <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
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
          <div>{renderRoutes()}</div>
        </Layout.BackendPanel>
      </Authorize>
    </div>
  );
}

export default withConfirmation(ReadingGroupWrapper);
