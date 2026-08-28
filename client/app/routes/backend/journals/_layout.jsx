import { Outlet } from "react-router";
import authorize from "lib/react-router/loaders/authorize";

export const loader = ({ context, url }) => {
  return authorize({
    url,
    context,
    ability: "update",
    entity: ["journal"]
  });
};

export default function JournalsLayout() {
  return (
    <main id="skip-to-main" tabIndex={-1} className="backend-detail">
      <Outlet />
    </main>
  );
}
