import { useTranslation } from "react-i18next";
import { useOutletContext, useMatches } from "react-router";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import Dialog from "global/components/dialog";
import TextsList from "backend/components/project/TextsList";
import { useAuthorizeRoute } from "hooks";
import useConfirmation from "hooks/useConfirmation";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";

function ProjectTextsLayout({ setScreenReaderStatus, renderLiveRegion }) {
  const { t } = useTranslation();
  const project = useOutletContext();
  useAuthorizeRoute({
    entity: project,
    ability: "manageTexts",
    message: t("errors.access_denied.authorization_admin_type", {
      type: t("glossary.text_other")
    })
  });

  const matches = useMatches();
  const { confirm, confirmation } = useConfirmation();

  const closeUrl = `/backend/projects/${project.id}/texts`;

  const currentMatch = matches[matches.length - 1];
  const isIngestRoute = currentMatch?.handle?.ingest;

  const getDrawerProps = () => {
    if (isIngestRoute) {
      return {
        lockScroll: "always",
        wide: true,
        lockScrollClickCloses: false,
        closeUrl,
        context: "ingestion"
      };
    }
    return {
      lockScroll: "always",
      wide: true,
      lockScrollClickCloses: false,
      closeUrl
    };
  };

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawer drawerProps={getDrawerProps()} context={project} />
      <TextsList
        project={project}
        confirm={confirm}
        setScreenReaderStatus={setScreenReaderStatus}
      />
      {renderLiveRegion("alert")}
    </section>
  );
}

export default withScreenReaderStatus(ProjectTextsLayout, false);
