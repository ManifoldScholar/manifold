import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import OutletWithDrawers from "components/global/router/OutletWithDrawers";
import Dialog from "components/global/dialog";
import TextsList from "components/backend/project/TextsList";
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

  const { confirm, confirmation } = useConfirmation();

  const closeUrl = `/backend/projects/${project.id}/texts`;

  const drawerProps = [
    {
      lockScroll: "always",
      wide: true,
      lockScrollClickCloses: false,
      closeUrl,
      context: "ingestion"
    },
    {
      lockScroll: "always",
      wide: true,
      lockScrollClickCloses: false,
      closeUrl,
      context: "backend"
    }
  ];

  return (
    <section>
      {confirmation && <Dialog.Confirm {...confirmation} />}
      <OutletWithDrawers drawerProps={drawerProps} context={project} />
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
