import { Outlet, useOutletContext } from "react-router";

export default function VolumesLayout() {
  const journal = useOutletContext();
  return <Outlet context={journal} />;
}
