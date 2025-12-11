import { Outlet, useOutletContext } from "react-router";
import { useAuthorizeRoute } from "hooks";
import { useTranslation } from "react-i18next";

export default function ResourceCollectionsLayout() {
  const project = useOutletContext();
  const { t } = useTranslation();
  useAuthorizeRoute({
    entity: project,
    ability: "manageResourceCollections",
    message: t("errors.access_denied.authorization_admin_type", {
      type: t("glossary.resource_collection_other")
    })
  });

  return <Outlet context={project} />;
}
