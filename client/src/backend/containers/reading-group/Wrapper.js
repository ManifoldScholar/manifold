import { useCallback } from "react";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import { readingGroupsAPI } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/Authorize";
import { useFetch, useApiCallback, useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import capitalize from "lodash/capitalize";

function ReadingGroupWrapper({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: readingGroup, refresh } = useFetch({
    request: [readingGroupsAPI.show, id]
  });
  const destroy = useApiCallback(readingGroupsAPI.destroy, {
    removes: readingGroup
  });

  const notifyDestroy = useNotification(rg => ({
    level: 0,
    id: `READING_GROUP_DESTROYED_${rg.id}`,
    heading: t("notifications.reading_group_delete"),
    body: t("notifications.delete_entity_body", {
      title: rg?.name
    }),
    expiration: 5000
  }));

  const destroyAndRedirect = useCallback(() => {
    const redirect = () => navigate(lh.link("backendReadingGroups"));
    destroy(readingGroup.id).then(
      () => {
        notifyDestroy(readingGroup);
        redirect();
      },
      () => redirect()
    );
  }, [destroy, navigate, readingGroup, notifyDestroy]);

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
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "delete",
      icon: "delete32",
      onClick: handleReadingGroupDestroy
    }
  ];

  if (!readingGroup) return null;

  const subpage = location.pathname.split("/")[4]?.replace("-", "_");

  const breadcrumbs = [
    {
      to: lh.link("backendReadingGroups"),
      label: t("glossary.reading_group_title_case_other")
    },
    {
      to: lh.link("backendReadingGroup", readingGroup.id),
      label: readingGroup.attributes.name
    }
  ];

  return (
    <div>
      <Authorize
        entity={readingGroup}
        failureNotification={{
          body: t("groups.unauthorized_edit")
        }}
        failureRedirect
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
          <div>
            <Outlet context={{ refresh, readingGroup }} />
          </div>
        </Layout.BackendPanel>
      </Authorize>
    </div>
  );
}

export default withConfirmation(ReadingGroupWrapper);
