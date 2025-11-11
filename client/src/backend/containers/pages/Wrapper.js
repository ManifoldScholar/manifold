import { Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { pagesAPI, requests } from "api";
import lh from "helpers/linkHandler";
import Layout from "backend/components/layout";
import withConfirmation from "hoc/withConfirmation";
import PageHeader from "backend/components/layout/PageHeader";
import { useFetch, useApiCallback, useNotification } from "hooks";
import Authorize from "hoc/Authorize";

function PageWrapper({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: page } = useFetch({
    request: [pagesAPI.show, id],
    options: { requestKey: requests.bePage },
    condition: !!id
  });

  const deletePage = useApiCallback(pagesAPI.destroy, {
    requestKey: requests.bePageDestroy,
    removes: page
  });

  const notifyDestroy = useNotification(p => ({
    level: 0,
    id: `PAGE_DESTROYED_${p.id}`,
    heading: t("notifications.page_delete"),
    body: t("notifications.delete_record_body"),
    expiration: 3000
  }));

  const doDestroy = async () => {
    if (!page) return;
    try {
      await deletePage(page.id);
      notifyDestroy(page);
      navigate(lh.link("backendRecordsPages"));
    } catch {
      navigate(lh.link("backendRecordsPages"));
    }
  };

  const handleDestroy = () => {
    const heading = t("modals.delete_page");
    const message = t("modals.confirm_body");
    confirm(heading, message, doDestroy);
  };

  const utility = [];
  if (page) {
    utility.push(
      {
        label: "actions.view",
        route: "frontendPage",
        slug: page.attributes.slug,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        authorize: "update",
        icon: "delete32",
        onClick: handleDestroy
      }
    );
  }

  if (!page) return null;

  return (
    <Authorize
      failureNotification={{
        body: t("records.pages.unauthorized_update")
      }}
      failureRedirect
      entity={page}
      ability="update"
    >
      <PageHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
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
    </Authorize>
  );
}

PageWrapper.displayName = "Pages.Wrapper";

export default withConfirmation(PageWrapper);
