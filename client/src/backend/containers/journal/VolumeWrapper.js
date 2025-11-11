import { Outlet, useOutletContext } from "react-router-dom";

export default function JournalVolumeWrapper() {
  const context = useOutletContext() || {};
  return <Outlet context={context} />;
}
