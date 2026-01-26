import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Layout from "backend/components/layout";
import { notificationActions } from "actions";
import { textsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import withConfirmation from "hoc/withConfirmation";
import HeadContent from "global/components/HeadContent";
import PageHeader from "backend/components/layout/PageHeader";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import { getBreadcrumbs } from "./breadcrumbs";
import Authorize from "hoc/Authorize";
import { useFetch, useApiCallback } from "hooks";

function TextWrapperContainer({ confirm }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { data: text, refresh } = useFetch({
    request: [textsAPI.show, id],
    condition: !!id
  });

  const destroyText = useApiCallback(textsAPI.destroy, {
    requestKey: requests.beTextDestroy,
    removes: text
  });

  const toggleEpubExport = useApiCallback(textsAPI.toggleEpubV3Export);

  const utility = useMemo(() => {
    if (!text) return [];

    const notifyDestroy = () => {
      const notification = {
        level: 0,
        id: `TEXT_DESTROYED_${text.id}`,
        heading: t("notifications.text_delete"),
        body: t("notifications.text_delete_body", {
          title: text.attributes.titlePlaintext
        }),
        expiration: 5000
      };
      dispatch(notificationActions.addNotification(notification));
    };

    const redirectToProjectTexts = () => {
      const projectId = text.relationships.project.id;
      const redirectUrl = lh.link("backendProjectTexts", projectId);
      navigate(redirectUrl);
    };

    const doDestroy = async () => {
      await destroyText(text.id);
      notifyDestroy();
      redirectToProjectTexts();
    };

    const handleTextDestroy = () => {
      const heading = t("modals.delete_text");
      const message = t("modals.delete_text_body");
      confirm(heading, message, doDestroy);
    };

    const handleToggleEpubExport = async () => {
      await toggleEpubExport(text.id);
      refresh();
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
        route: "reader",
        slug: text.attributes.slug,
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
    dispatch,
    navigate,
    toggleEpubExport,
    refresh
  ]);

  if (!text) return null;

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

  const breadcrumbs = getBreadcrumbs(text, belongsToJournalIssue, t);

  return (
    <>
      <Authorize
        entity={text}
        failureNotification={{
          body: t("texts.unauthorized")
        }}
        failureRedirect
        ability={["update"]}
      >
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
          <div>
            <Outlet context={{ text, refresh }} />
          </div>
        </Layout.BackendPanel>
      </Authorize>
    </>
  );
}

TextWrapperContainer.displayName = "Text.Wrapper";

export default withConfirmation(TextWrapperContainer);
