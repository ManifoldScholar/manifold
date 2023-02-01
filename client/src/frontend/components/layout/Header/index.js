import React, { useContext } from "react";
import PropTypes from "prop-types";
import HeaderNotifications from "global/components/HeaderNotifications";
import { FrontendModeContext } from "helpers/contexts";
import CustomHeader from "./CustomHeader";
import LibraryHeader from "./LibraryHeader";
import StandaloneHeader from "./StandaloneHeader";
import PressHeader from "./PressHeader";

export default function LayoutHeader({ pages = [], ...rest }) {
  const { isLibrary, isStandalone } = useContext(FrontendModeContext);

  return (
    <>
      <header className="header-app header-app--sticky">
        <CustomHeader />
        <PressHeader />
        {isLibrary && <LibraryHeader pages={pages} {...rest} />}
        <HeaderNotifications scope="global" />
      </header>
      <div className="header-app header-app--static">
        {isStandalone && <StandaloneHeader pages={pages} {...rest} />}
      </div>
    </>
  );
}

LayoutHeader.displayName = "Layout.Header";

LayoutHeader.propTypes = {
  visibility: PropTypes.object,
  location: PropTypes.object,
  authentication: PropTypes.object,
  notifications: PropTypes.object,
  commonActions: PropTypes.object,
  settings: PropTypes.object,
  pages: PropTypes.array
};
