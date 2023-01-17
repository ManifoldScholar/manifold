import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "hooks";
import lh from "helpers/linkHandler";
import Item from "./Item";
import * as Styled from "./styles";

const UserMenuBody = forwardRef(
  (
    { callbacks, context = "frontend", visible = false, className, ...props },
    ref
  ) => {
    const currentUser = useCurrentUser();
    const { t } = useTranslation();

    return (
      <Styled.List
        ref={ref}
        className={className}
        $context={context}
        $visible={visible}
        {...props}
      >
        {context !== "reader" && <Styled.Tail />}
        {!!currentUser && (
          <Item
            to={lh.link("frontendStarred")}
            title={t("pages.my_starred")}
            icon="star24"
            onClick={() => callbacks.hideUserPanel()}
          />
        )}
        {currentUser?.attributes.classAbilities.readingGroup.read && (
          <>
            <Item
              to={lh.link("frontendAnnotations")}
              title={t("pages.my_notes")}
              icon="notes24"
              onClick={() => callbacks.hideUserPanel()}
            />
            <Item
              to={lh.link("frontendMyReadingGroups")}
              title={t("pages.my_groups")}
              icon="annotationGroup24"
              onClick={() => callbacks.hideUserPanel()}
            />
          </>
        )}
        <Item
          as="button"
          title={t("navigation.user.edit_profile")}
          icon="editProfile24"
          onClick={() => {
            callbacks.hideUserPanel();
            callbacks.toggleSignInUpOverlay();
          }}
        />
        <Item
          to={lh.link("subscriptions")}
          title={t("navigation.user.notifications")}
          icon="notifications24"
          onClick={() => callbacks.hideUserPanel()}
        />
        <Item
          to={lh.link("privacy")}
          title={t("navigation.user.privacy")}
          icon="privacy24"
          onClick={() => callbacks.hideUserPanel()}
        />
        <Item
          as="button"
          title={t("navigation.user.logout")}
          icon="logout24"
          onClick={() => {
            callbacks.logout();
            callbacks.hideUserPanel();
          }}
        />
      </Styled.List>
    );
  }
);

UserMenuBody.displayName = "UserMenuBody";

UserMenuBody.propTypes = {
  callbacks: PropTypes.shape({
    hideUserPanel: PropTypes.func.isRequired,
    toggleSignInUpOverlay: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired
  }),
  visible: PropTypes.bool,
  context: PropTypes.oneOf(["frontend", "backend", "reader"])
};

export default UserMenuBody;
