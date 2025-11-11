import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useFromStore } from "hooks";
import lh from "helpers/linkHandler";

function PublicReadingGroupsContainer() {
  const {
    attributes: {
      general: { disablePublicReadingGroups }
    }
  } = useFromStore({ requestKey: "settings", action: "select" });

  const { pathname } = useLocation();

  if (disablePublicReadingGroups && pathname === "/groups")
    return <Navigate to={lh.link("frontendMyReadingGroups")} />;

  return <Outlet />;
}

export default PublicReadingGroupsContainer;
