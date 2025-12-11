import { useTranslation } from "react-i18next";
import { useAuthentication, useLogout } from "hooks";
import * as Styled from "./styles";

export default function Logout() {
  const { t } = useTranslation();
  const logout = useLogout();
  const { authenticated, currentUser } = useAuthentication();

  const handleLogout = () => {
    logout();
  };

  return authenticated ? (
    <Styled.Wrapper>
      <div>
        {t("forms.signin_overlay.current_user", {
          name: currentUser?.attributes?.fullName
        })}
      </div>
      <button
        aria-label={t("forms.signin_overlay.log_out")}
        className="button-secondary"
        onClick={handleLogout}
      >
        {t("forms.signin_overlay.log_out")}
      </button>
    </Styled.Wrapper>
  ) : null;
}

Logout.displayName = "Global.SignInUp.Logout";
