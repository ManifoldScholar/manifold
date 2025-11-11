import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom-v5-compat";
import { useCurrentUser } from "hooks";
import FatalErrorRender from ".";

export default function FatalErrorAppWrapper(props) {
  const {
    fatalError: { error },
    redirectPath
  } = props;

  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useCurrentUser();

  if (!error) return null;

  const isAuthorizationError = error.status === 403 || error.status === 401;

  if (isAuthorizationError && redirectPath === "/login") return null;

  const redirectOrNotify = () => {
    if (!currentUser?.id) {
      const loginPath = redirectPath
        ? `/login?redirect_uri=${redirectPath}`
        : "/login";
      return navigate(loginPath);
    }

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
