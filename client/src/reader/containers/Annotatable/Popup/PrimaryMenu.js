import React from "react";
import PropTypes from "prop-types";
import { Menus } from "reader/components/annotation/popup";
import { useAnnotationMenu } from "reader/components/annotation/popup/hooks";

import withReadingGroups from "hoc/withReadingGroups";

function PrimaryMenu({
  currentAnnotatingReadingGroup,
  readingGroups,
  setAnnotatingReadingGroup,
  text,
  section,
  selectionState,
  actions,
  activeAnnotation,
  direction,
  visible,
  clearSelection
}) {
  const {
    menus,
    activeMenu,
    lastActiveMenu,
    setActiveMenu,
    handleKeyDown
  } = useAnnotationMenu({
    menuArray: ["main", "share", "readingGroup"],
    defaultMenu: "main",
    visible,
    clearSelection
  });

  function handleReadingGroupSelect(id) {
    if (id === currentAnnotatingReadingGroup) return;
    setAnnotatingReadingGroup(id);
  }

  const submenuProps = {
    direction,
    onBackClick: () => setActiveMenu("main"),
    onKeyDown: event => handleKeyDown(event)
  };

  return (
    <>
      <Menus.Main
        menu={menus.main}
        visible={activeMenu === "main"}
        direction={direction}
        activeMenu={activeMenu}
        lastActiveMenu={lastActiveMenu}
        openSubmenu={name => setActiveMenu(name)}
        onKeyDown={event => handleKeyDown(event, "main")}
        text={text}
        actions={actions}
        activeAnnotation={activeAnnotation}
        readingGroups={readingGroups}
        currentReadingGroup={currentAnnotatingReadingGroup}
      />
      <Menus.Share
        menu={menus.share}
        visible={activeMenu === "share"}
        text={text}
        section={section}
        selectionState={selectionState}
        actions={actions}
        {...submenuProps}
      />
      <Menus.ReadingGroup
        menu={menus.readingGroup}
        visible={activeMenu === "readingGroup"}
        onSelect={handleReadingGroupSelect}
        readingGroups={readingGroups}
        currentReadingGroup={currentAnnotatingReadingGroup}
        {...submenuProps}
      />
    </>
  );
}

PrimaryMenu.displayName = "Annotation.Popup.PrimaryMenu";

PrimaryMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  text: PropTypes.object.isRequired,
  section: PropTypes.object.isRequired,
  selectionState: PropTypes.object.isRequired,
  activeAnnotation: PropTypes.object,
  currentAnnotatingReadingGroup: PropTypes.string,
  readingGroups: PropTypes.array,
  setAnnotatingReadingGroup: PropTypes.func,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool
};

export default withReadingGroups(PrimaryMenu);
