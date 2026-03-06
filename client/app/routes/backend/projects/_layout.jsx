import { Outlet } from "react-router";
import authorize from "app/routes/utility/loaders/authorize";

export const loader = ({ request, context }) => {
  return authorize({
    request,
    context,
    ability: "update",
    entity: ["project"]
  });
};

export default function ProjectsLayout() {
  return (
    <main id="skip-to-main" tabIndex={-1} className="backend-detail">
      <Outlet />
    </main>
  );
}
