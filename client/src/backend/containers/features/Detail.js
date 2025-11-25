import { useOutletContext } from "react-router-dom";
import Properties from "backend/components/feature/Properties";

export default function FeatureDetail() {
  const outletContext = useOutletContext() || {};
  const { feature } = outletContext;

  if (!feature) return null;

  return <Properties feature={feature} />;
}

FeatureDetail.displayName = "Features.Detail";
