import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { useCurrentUser } from "hooks";
import FatalErrorRender from ".";

export default function FatalErrorAppWrapper(props) {
  const {
    fatalError: { error },
    redirectPath
  } = props;

  const { t } = useTranslation();
  const history = useHistory();
  const currentUser = useCurrentUser();

  if (!error) return null;

  const isAuthorizationError =
    error.method === "GET" && (error.status === 403 || error.status === 401);

  const redirectOrNotify = () => {
    if (!currentUser?.id) {
      return history.push({
        pathname: "/login",
        search: redirectPath ? `?redirect_uri=${redirectPath}` : undefined
      });
    }

    return (
      <FatalErrorRender
        headerLineOne={t("errors.access_denied.header")}
        headerLineTwo=""
        contained
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
