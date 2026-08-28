import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useNotifications } from "hooks";
import { PROJECT_AUTHORIZATION_ERROR_PARAM } from "lib/react-router/loaders/loadEntity";

/**
 * Shows a notification when loadEntity redirected here from restricted project
 * content (see maybeRedirectToProject), then strips the flag from the URL.
 */
export default function ProjectAuthorizationErrorNotice() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { addNotification } = useNotifications();

  const params = new URLSearchParams(location.search);
  const flagged = params.has(PROJECT_AUTHORIZATION_ERROR_PARAM);

  useEffect(() => {
    if (!flagged) return;
    addNotification({
      id: "projectAuthorizationError",
      level: 1,
      heading: t("messages.project_authorization_warning.heading")
    });
    const next = new URLSearchParams(location.search);
    next.delete(PROJECT_AUTHORIZATION_ERROR_PARAM);
    const search = next.toString();
    navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true }
    );
  }, [
    flagged,
    addNotification,
    t,
    navigate,
    location.pathname,
    location.search
  ]);

  return null;
}

ProjectAuthorizationErrorNotice.displayName =
  "Frontend.Project.AuthorizationErrorNotice";
