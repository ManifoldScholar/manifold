import React from "react";
import { useTranslation } from "react-i18next";
import { currentUserActions } from "actions";
import { useDispatch } from "react-redux";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function Logout() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { authenticated, currentUser } = useFromStore("authentication") ?? {};

  const handleLogout = () => {
    const action = currentUserActions.logout();
    dispatch(action);
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
