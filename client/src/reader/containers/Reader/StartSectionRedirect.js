import { Navigate, useOutletContext } from "react-router-dom";

export default function StartSectionRedirect() {
  const { text } = useOutletContext() || {};

  if (!text) return null;

  const { startTextSectionId } = text.attributes;
  return <Navigate to={`section/${startTextSectionId}`} replace />;
}
