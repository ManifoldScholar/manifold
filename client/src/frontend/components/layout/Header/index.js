import { useContext } from "react";
import PropTypes from "prop-types";
import HeaderNotifications from "global/components/HeaderNotifications";
import { FrontendModeContext } from "helpers/contexts";
import CustomHeader from "./CustomHeader";
import LibraryHeader from "./LibraryHeader";
import StandaloneHeader from "./StandaloneHeader";
import PressHeader from "./PressHeader";

export default function LayoutHeader({ alwaysVisible }) {
  const { isLibrary, isStandalone } = useContext(FrontendModeContext);

  return (
    <>
      <header className="header-app header-app--sticky">
        <CustomHeader />
        <PressHeader />
        {isLibrary && <LibraryHeader />}
        <HeaderNotifications scope="global" />
      </header>
      <div className="header-app header-app--static">
        {isStandalone && <StandaloneHeader alwaysVisible={alwaysVisible} />}
      </div>
    </>
  );
}

LayoutHeader.displayName = "Layout.Header";

LayoutHeader.propTypes = {
  alwaysVisible: PropTypes.bool
};
