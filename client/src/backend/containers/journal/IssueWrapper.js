import { Outlet, useOutletContext } from "react-router-dom";

export default function JournalIssueWrapper() {
  const context = useOutletContext() || {};
  return <Outlet context={context} />;
}
