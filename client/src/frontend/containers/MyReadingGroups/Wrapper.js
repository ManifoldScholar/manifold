import { useRef, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import lh from "helpers/linkHandler";
import List from "./List";
import { useCurrentUser } from "hooks";

export default function MyReadingGroupsContainer() {
  const navigate = useNavigate();
  const refreshRef = useRef(null);
  const currentUser = useCurrentUser();

  const handleNewGroupSuccess = useCallback(() => {
    navigate(lh.link("frontendMyReadingGroups"));

    if (refreshRef.current?.refresh) {
      refreshRef.current.refresh();
    }
  }, [navigate]);

  if (!currentUser)
    return (
      <Navigate
        to={lh.link("frontendLogin")}
        search={{ redirect_uri: "/my/groups" }}
      />
    );

  return (
    <>
      <List ref={refreshRef} />
      <OutletWithDrawer
        drawerProps={{
          context: "frontend",
          size: "wide",
          position: "overlay",
          lockScroll: "always",
          closeUrl: lh.link("frontendMyReadingGroups")
        }}
        context={{
          onSuccess: handleNewGroupSuccess
        }}
      />
    </>
  );
}

MyReadingGroupsContainer.displayName = "Frontend.Containers.MyReadingGroups";
