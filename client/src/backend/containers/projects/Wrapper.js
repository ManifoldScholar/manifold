import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Authorize from "hoc/Authorize";

export default function ProjectsWrapper() {
  const { t } = useTranslation();

  return (
    <Authorize
      ability="update"
      entity={["project"]}
      failureNotification={{
        body: t("projects.unauthorized")
      }}
      failureRedirect
    >
      <main id="skip-to-main" tabIndex={-1} className="backend-detail">
        <Outlet />
      </main>
    </Authorize>
  );
}
