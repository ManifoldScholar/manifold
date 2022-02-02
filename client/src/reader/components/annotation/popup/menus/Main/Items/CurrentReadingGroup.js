import React from "react";
import PropTypes from "prop-types";
import { MenuItem as ReakitMenuItem } from "reakit/Menu";
import IconComposer from "global/components/utility/IconComposer";
import Authorize from "hoc/Authorize";
import withCurrentUser from "hoc/withCurrentUser";

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

  function getCurrentGroupName() {
    if (currentReadingGroup === "public") return "My Public Annotations";
    if (currentReadingGroup === "private") return "My Private Annotations";

    const currentGroup = readingGroups.find(
      group => group.id === currentReadingGroup
    );
    return currentGroup.attributes.name;
  }

  return (
    <Authorize kind="any">
      <ReakitMenuItem
        {...menu}
        onClick={onClick}
        tabIndex={menu?.visible ? undefined : -1}
        aria-haspopup="menu"
        aria-expanded={activeMenu === "readingGroup"}
        data-name="readingGroup"
        className="annotation-popup__button annotation-popup__button--stacked annotation-popup__button--secondary-dark"
      >
        <span className="screen-reader-text">Select reading group</span>
        <span className="annotation-popup__button-text">
          {canAccessReadingGroups ? "Current Group:" : "Current Visibility:"}
        </span>
        <div className="annotation-popup__button-inner-row">
          <span className="annotation-popup__button-text annotation-popup__button-text--small">
            {getCurrentGroupName()}
          </span>
          <IconComposer
            icon="disclosureUp16"
            size={22}
            className="annotation-popup__button-icon annotation-popup__button-icon--disclosure"
          />
        </div>
      </ReakitMenuItem>
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
