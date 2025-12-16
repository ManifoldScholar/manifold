import { forwardRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "hooks";
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
        data-context={context}
        inert={!visible ? "" : undefined}
        {...props}
      >
        {!!currentUser && (
          <Item
            to="/my/starred"
            title={t("pages.my_starred")}
            icon="star24"
            onClick={() => callbacks.hideUserPanel()}
          />
        )}
        {currentUser?.attributes.classAbilities.readingGroup.read && (
          <>
            <Item
              to="/my/notes"
              title={t("pages.my_notes")}
              icon="notes24"
              onClick={() => callbacks.hideUserPanel()}
            />
            <Item
              to="/my/groups"
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
          to="/subscriptions"
          title={t("navigation.user.notifications")}
          icon="notifications24"
          onClick={() => callbacks.hideUserPanel()}
        />
        <Item
          to="/privacy"
          title={t("navigation.user.privacy")}
          icon="privacy24"
          onClick={() => callbacks.hideUserPanel()}
        />
        <Item
          as="button"
          title={t("navigation.user.log_out")}
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
