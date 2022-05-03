import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useAuthentication } from "hooks";
import { useTranslation } from "react-i18next";
import Avatar from "global/components/avatar";
import * as Styled from "./styles";

const UserMenuButton = forwardRef(
  (
    {
      context = "frontend",
      callbacks,
      className,
      onClick: onClickIgnored,
      ...props
    },
    ref
  ) => {
    const { authenticated, currentUser } = useAuthentication();
    const { t } = useTranslation();

    function handleClick(event) {
      event.stopPropagation();
      authenticated
        ? callbacks.toggleUserPanel()
        : callbacks.toggleSignInUpOverlay();
    }

    return (
      <Styled.Button
        ref={ref}
        onClick={handleClick}
        className={className}
        $context={context}
        {...(authenticated
          ? props
          : {
              "aria-expanded": props["aria-expanded"],
              "aria-haspopup": "dialog"
            })}
      >
        <span className="screen-reader-text">
          {authenticated
            ? t("navigation.user.settings")
            : t("navigation.user.sign_in")}
        </span>
        <Avatar
          url={currentUser?.attributes.avatarStyles.smallSquare}
          iconSize={context === "reader" ? 24 : 64}
          ariaHidden
        />
      </Styled.Button>
    );
  }
);

UserMenuButton.displayName = "UserMenuButton";

UserMenuButton.propTypes = {
  callbacks: PropTypes.shape({
    toggleUserPanel: PropTypes.func.isRequired,
    toggleSignInUpOverlay: PropTypes.func.isRequired
  }),
  visible: PropTypes.bool,
  context: PropTypes.oneOf(["frontend", "backend", "reader"])
};

export default UserMenuButton;
