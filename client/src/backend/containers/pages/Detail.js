import { useOutletContext } from "react-router-dom";
import Properties from "backend/components/page/Properties";

export default function PageDetail() {
  const outletContext = useOutletContext() || {};
  const { page } = outletContext;

  if (!page) return null;

  return <Properties page={page} />;
}

PageDetail.displayName = "Pages.Detail";
