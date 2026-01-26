import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import Authorize from "hoc/Authorize";

export default function JournalsWrapper() {
  const { t } = useTranslation();
  return (
    <Authorize
      ability="update"
      entity={["journal"]}
      failureNotification={{
        body: t("journals.unauthorized")
      }}
      failureRedirect
    >
      <div>
        <main id="skip-to-main" tabIndex={-1} className="backend-detail">
          <Outlet />
        </main>
      </div>
    </Authorize>
  );
}
