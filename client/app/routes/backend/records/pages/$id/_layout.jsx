import { Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { pagesAPI } from "api";
import loadEntity from "lib/react-router/loaders/loadEntity";
import Layout from "components/backend/layout";
import Dialog from "components/global/dialog";
import PageHeader from "components/backend/layout/PageHeader";
import { useApiCallback, useConfirmation, useNotifications } from "hooks";

export const loader = async ({ params, context, request }) => {
  return loadEntity({
    context,
    fetchFn: () => pagesAPI.show(params.id),
    request
  });
};

export default function PageDetailLayout({ loaderData: page }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { confirm, confirmation } = useConfirmation();

  const deletePage = useApiCallback(pagesAPI.destroy);
  const { addNotification } = useNotifications();

  const handleDestroy = () => {
    confirm({
      heading: t("modals.delete_page"),
      message: t("modals.confirm_body"),
      callback: async closeDialog => {
        try {
          await deletePage(page.id);
          addNotification({
            level: 0,
            id: `PAGE_DESTROYED_${page.id}`,
            heading: t("notifications.page_delete"),
            body: t("notifications.delete_record_body"),
            expiration: 3000
          });
          navigate("/backend/records/pages");
        } catch {
          closeDialog();
          addNotification({
            level: 2,
            id: `PAGE_DESTROY_FAILED_${page.id}`,
            heading: t("notifications.delete_failure", {
              entity: page.attributes.title
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
      path: `/page/${page.attributes.slug}`,
      icon: "eyeOpen32"
    },
    {
      label: "actions.delete",
      authorize: "update",
      icon: "delete32",
      onClick: handleDestroy
    }
  ];

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <PageHeader
        type="page"
        backUrl="/backend/records/pages"
        backLabel={t("records.pages.back_label")}
        title={page.attributes.title}
        subtitle={
          page.attributes.isExternalLink
            ? page.attributes.externalLink
            : `/page/${page.attributes.slug}`
        }
        actions={utility}
        icon="ResourceDocument64"
      />
      <Layout.BackendPanel>
        <Outlet context={{ page }} />
      </Layout.BackendPanel>
    </>
  );
}
