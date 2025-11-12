import { Outlet, Navigate } from "react-router-dom";
import lh from "helpers/linkHandler";
import { useCurrentUser } from "hooks";

export default function MyReadingGroupsContainer() {
  const currentUser = useCurrentUser();

  if (!currentUser)
    return (
      <Navigate
        to={lh.link("frontendLogin")}
        search={{ redirect_uri: "/my/starred" }}
      />
    );

  return <Outlet />;
}
