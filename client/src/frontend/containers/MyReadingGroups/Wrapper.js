import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import lh from "helpers/linkHandler";
import List from "./List";

export default function MyReadingGroupsContainer() {
  const navigate = useNavigate();
  const refreshRef = useRef(null);

  const handleNewGroupSuccess = () => {
    navigate(lh.link("frontendMyReadingGroups"));

    if (refreshRef.current?.refresh) {
      refreshRef.current.refresh();
    }
  };

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
