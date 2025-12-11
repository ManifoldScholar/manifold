import { Outlet, useOutletContext } from "react-router";
import { useAuthorizeRoute } from "hooks";
import { useTranslation } from "react-i18next";

export default function ResourcesLayout() {
  const project = useOutletContext();
  const { t } = useTranslation();
  useAuthorizeRoute({
    entity: project,
    ability: "manageResources",
    message: t("errors.access_denied.authorization_admin_type", {
      type: t("glossary.resource_other")
    })
  });

  return <Outlet context={project} />;
}
