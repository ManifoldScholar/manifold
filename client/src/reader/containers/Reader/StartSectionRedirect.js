import { Navigate, useOutletContext, useParams } from "react-router-dom";

export default function StartSectionRedirect() {
  const { text } = useOutletContext() || {};
  const { textId } = useParams();

  if (!text) return null;

  const { startTextSectionId } = text.attributes;
  const redirectPath = `/read/${textId}/section/${startTextSectionId}`;

  // For SSR, throw a Response object for redirect
  if (__SERVER__) {
    throw new Response(null, {
      status: 302,
      headers: { Location: redirectPath }
    });
  }

  return <Navigate to={`section/${startTextSectionId}`} replace />;
}
