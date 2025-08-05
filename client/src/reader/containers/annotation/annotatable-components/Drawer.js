import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Drawer from "global/containers/drawer";
import Drawers from "./Drawers";
import upperFirst from "lodash/upperFirst";

export default function AnnotatableDrawer(props) {
  const { t } = useTranslation();

  const { drawerState, close } = props;

  const DrawerContents = Drawers[upperFirst(drawerState)];

  const baseDrawerProps = {
    context: "reader",
    size: "wide",
    position: "overlay",
    padding: "none",
    open: drawerState !== null,
    closeCallback: close,
    lockScroll: "always",
    identifier: "annotations-drawer",
    title: t("actions.annotate")
  };

  return (
    <Drawer.Wrapper {...baseDrawerProps} {...DrawerContents?.drawerProps}>
      {DrawerContents ? <DrawerContents {...props} /> : null}
    </Drawer.Wrapper>
  );
}

AnnotatableDrawer.propTypes = {
  drawerState: PropTypes.string,
  actions: PropTypes.object.isRequired,
  close: PropTypes.func.isRequired
};
