import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Authorize from "hoc/Authorize";
import withCurrentUser from "hoc/withCurrentUser";
import * as Styled from "./styles";

function CurrentReadingGroup({
  menu,
  onClick,
  activeMenu,
  currentReadingGroup = "public",
  readingGroups,
  currentUser
}) {
  const canAccessReadingGroups =
    currentUser?.attributes.classAbilities.readingGroup.read;
  const { t } = useTranslation();

  function getCurrentGroupName() {
    if (currentReadingGroup === "public")
      return t("reader.my_public_annotations");
    if (currentReadingGroup === "private")
      return t("reader.my_private_annotations");

    const currentGroup = readingGroups.find(
      group => group.id === currentReadingGroup
    );
    return currentGroup.attributes.name;
  }

  return (
    <Authorize kind="any">
      <Styled.RGMenuItem
        {...menu}
        onClick={onClick}
        onTouchEnd={onClick}
        tabIndex={menu?.visible ? undefined : -1}
        aria-haspopup="menu"
        aria-expanded={activeMenu === "readingGroup"}
        data-name="readingGroup"
      >
        <span className="screen-reader-text">
          {t("reader.actions.select_reading_group")}
        </span>
        <Styled.Label aria-hidden>
          {canAccessReadingGroups
            ? t("reader.menus.popup.current_group")
            : t("reader.menus.popup.current_visibility")}
          :
        </Styled.Label>
        <Styled.Inner aria-hidden>
          <Styled.CurrentGroup>{getCurrentGroupName()}</Styled.CurrentGroup>
          <Styled.Icon icon="disclosureUp16" size={22} />
        </Styled.Inner>
      </Styled.RGMenuItem>
    </Authorize>
  );
}

CurrentReadingGroup.displayName =
  "Annotation.Popup.Menus.MainMenu.CurrentReadingGroup";

CurrentReadingGroup.propTypes = {
  menu: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  activeMenu: PropTypes.string,
  readingGroups: PropTypes.array,
  currentReadingGroup: PropTypes.string,
  currentUser: PropTypes.object
};

export default withCurrentUser(CurrentReadingGroup);
