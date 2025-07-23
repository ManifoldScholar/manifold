import PropTypes from "prop-types";
import { Menus } from "reader/components/annotation/popup";
import { useAnnotationMenu } from "reader/components/annotation/popup/hooks";

function HighlightMenu({
  direction,
  actions,
  visible,
  clearSelection,
  activeAnnotation
}) {
  const { menus, activeMenu, handleKeyDown } = useAnnotationMenu({
    menuArray: ["main"],
    defaultMenu: "main",
    visible,
    clearSelection
  });

  return (
    <Menus.Highlight
      menu={menus.main}
      visible={activeMenu === "main"}
      direction={direction}
      actions={actions}
      onKeyDown={handleKeyDown}
      activeAnnotation={activeAnnotation}
    />
  );
}

HighlightMenu.displayName = "Annotation.Popup.HighlightMenu";

HighlightMenu.propTypes = {
  actions: PropTypes.object.isRequired,
  direction: PropTypes.oneOf(["up", "down"]),
  visible: PropTypes.bool,
  activeAnnotation: PropTypes.object
};

export default HighlightMenu;
