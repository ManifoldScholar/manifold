import { Outlet } from "react-router-dom";
import { useFromStore } from "hooks";
import { useNavigate, useLocation } from "react-router-dom";
import lh from "helpers/linkHandler";

function PublicReadingGroupsContainer() {
  const {
    attributes: {
      general: { disablePublicReadingGroups }
    }
  } = useFromStore({ requestKey: "settings", action: "select" });

  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (disablePublicReadingGroups && pathname === "/groups")
    navigate(lh.link("frontendMyReadingGroups"));

  return <Outlet />;
}

export default PublicReadingGroupsContainer;
