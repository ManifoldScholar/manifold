import { useMemo } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useRevalidator } from "react-router";
import { textsAPI } from "api";
import authorize from "lib/react-router/loaders/authorize";
import loadEntity from "lib/react-router/loaders/loadEntity";
import Layout from "components/backend/layout";
import PageHeader from "components/backend/layout/PageHeader";
import HeadContent from "components/global/HeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import { getTextBreadcrumbs } from "helpers/breadcrumbs";
import Dialog from "components/global/dialog";
import navigation from "helpers/navigation";
import { useApiCallback, useNotifications } from "hooks";
import useConfirmation from "hooks/useConfirmation";

export const loader = async ({ params, context, request }) => {
  const text = await loadEntity({
    context,
    fetchFn: () => textsAPI.show(params.id),
    request
  });
  await authorize({
    request,
    context,
    entity: text,
    ability: "update"
  });
  return text;
};

export default function TextDetailLayout({ loaderData: text }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { confirm, confirmation } = useConfirmation();
  const { addNotification } = useNotifications();
  const { revalidate } = useRevalidator();

  const destroyText = useApiCallback(textsAPI.destroy);
  const toggleEpubExport = useApiCallback(textsAPI.toggleEpubV3Export);

  const utility = useMemo(() => {
    const handleTextDestroy = () => {
      confirm({
        heading: t("modals.delete_text"),
        message: t("modals.delete_text_body"),
        callback: async closeDialog => {
          try {
            await destroyText(text.id);
            addNotification({
              level: 0,
              id: `TEXT_DESTROYED_${text.id}`,
              heading: t("notifications.text_delete"),
              body: t("notifications.text_delete_body", {
                title: text.attributes.titlePlaintext
              }),
              expiration: 5000
            });
            const projectId = text.relationships.project.id;
            navigate(`/backend/projects/${projectId}/texts`);
          } catch {
            closeDialog();
          }
        }
      });
    };

    const handleToggleEpubExport = async () => {
      await toggleEpubExport(text.id);
      revalidate();
    };

    const {
      attributes: {
        exportsAsEpubV3,
        epubV3ExportUrl,
        ingestionSourceDownloadUrl,
        ingestionExternalSourceUrl
      }
    } = text;

    const base = [
      {
        label: "actions.view",
        path: `/read/${text.attributes.slug}`,
        icon: "eyeOpen32"
      },
      {
        label: "actions.delete",
        authorize: "delete",
        icon: "delete32",
        onClick: handleTextDestroy
      },
      {
        label: exportsAsEpubV3
          ? t("texts.disable_epub")
          : t("texts.enable_epub"),
        icon: exportsAsEpubV3 ? "circleMinus24" : "circlePlus24",
        onClick: handleToggleEpubExport
      }
    ];

    const epubDownload = epubV3ExportUrl
      ? [
          {
            label: "texts.download_epub",
            href: epubV3ExportUrl,
            download: true,
            icon: "download24"
          }
        ]
      : [];

    const ingestionSourceDownload = ingestionSourceDownloadUrl
      ? [
          {
            label: "texts.download_source",
            href: ingestionSourceDownloadUrl,
            download: true,
            icon: "download24"
          }
        ]
      : [];

    const externalLink = ingestionExternalSourceUrl
      ? [
          {
            label: "texts.visit_source",
            href: ingestionExternalSourceUrl,
            download: false,
            icon: "link24"
          }
        ]
      : [];

    return [
      ...base,
      ...epubDownload,
      ...ingestionSourceDownload,
      ...externalLink
    ];
  }, [
    text,
    t,
    confirm,
    destroyText,
    addNotification,
    navigate,
    toggleEpubExport,
    revalidate
  ]);

  const secondaryLinks = navigation.text(text);
  const subpage = location.pathname.split("/")[5]?.replace("-", "_");

  const parentProps = {
    parentTitle: text.relationships.project.attributes.titleFormatted,
    parentSubtitle: text.relationships.project.attributes.subtitle,
    texts: text.attributes.projectTextsNav,
    parentId: text.relationships.project.id
  };

  const belongsToJournalIssue =
    text.relationships.project.attributes.isJournalIssue;

  const breadcrumbs = getTextBreadcrumbs(text, belongsToJournalIssue, t);

  return (
    <>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      {subpage && (
        <HeadContent
          title={`${t(`titles.${subpage}`)} | ${
            text.attributes.titlePlaintext
          } | ${t("common.admin")}`}
          appendDefaultTitle
        />
      )}
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs ?? []} />
      <PageHeader
        type={belongsToJournalIssue ? "article" : "text"}
        title={text.attributes.titleFormatted}
        subtitle={text.attributes.subtitle}
        actions={utility}
        secondaryLinks={secondaryLinks}
        {...parentProps}
      />
      <Layout.BackendPanel
        sidebar={
          <Layout.SecondaryNav
            links={secondaryLinks}
            panel
            ariaLabel={t("texts.settings")}
          />
        }
      >
        <Outlet context={text} />
      </Layout.BackendPanel>
    </>
  );
}
