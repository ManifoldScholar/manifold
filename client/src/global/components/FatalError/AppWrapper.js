import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useLocation, Navigate } from "react-router-dom";
import { useCurrentUser } from "hooks";
import FatalErrorRender from ".";

export default function FatalErrorAppWrapper(props) {
  const {
    fatalError: { error },
    redirectPath
  } = props;

  const { t } = useTranslation();
  const location = useLocation();
  const currentUser = useCurrentUser();

  const isAuthorizationError = error.status === 403 || error.status === 401;

  if (!error) return null;

  if (isAuthorizationError && redirectPath === "/login") return null;

  const renderAccessDenied = () => {
    const title =
      error.body
        ?.replace("You are not authorized to read ", "")
        .replace(".", "") ?? "this content";
    const isRG = location.pathname.includes("groups");
    const isAdmin = location.pathname.includes("backend");
    const isPost = error.method === "POST";

    return (
      <FatalErrorRender
        headerLineOne={t("errors.access_denied.header")}
        headerLineTwo=""
        userMessage={
          /* eslint-disable-next-line no-nested-ternary */
          isPost
            ? error.body
            : /* eslint-disable-next-line no-nested-ternary */
            isRG
            ? isAdmin
              ? t("errors.access_denied.authorization_admin_reading_group")
              : t("errors.access_denied.authorization_reading_group")
            : t("errors.access_denied.authorization", {
                title
              })
        }
        contained
        hideStatus
        {...props}
      />
    );
  };

  const redirectOrNotify = () => {
    if (currentUser?.id) return renderAccessDenied();

    const loginPath = redirectPath
      ? `/login?redirect_uri=${redirectPath}`
      : "/login";

    if (__SERVER__) {
      throw new Response(null, {
        status: 302,
        headers: { Location: loginPath }
      });
    }

    return <Navigate to={loginPath} replace />;
  };

  if (isAuthorizationError) return redirectOrNotify();

  return <FatalErrorRender {...props} />;
}

FatalErrorAppWrapper.propTypes = {
  fatalError: PropTypes.shape({
    error: PropTypes.object,
    type: PropTypes.string
  }).isRequired,
  headerLineOne: PropTypes.string,
  headerLineTwo: PropTypes.string,
  dismiss: PropTypes.func,
  redirectPath: PropTypes.string
};
