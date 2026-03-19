import { Outlet, useOutletContext } from "react-router";
import { useAuthorizeRoute } from "hooks";

export default function EditorLayout() {
  const project = useOutletContext();
  useAuthorizeRoute({ entity: project, ability: "update" });

  return <Outlet context={project} />;
}
