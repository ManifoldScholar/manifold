import { useContext } from "react";
import { ManifoldAnalyticsContext } from "helpers/contexts";

export default function useAnalyticsContext() {
  const context = useContext(ManifoldAnalyticsContext);
  if (!context) {
    throw new Error(`Could not detect a ManifoldAnalytics context.`);
  }
  return context;
}
