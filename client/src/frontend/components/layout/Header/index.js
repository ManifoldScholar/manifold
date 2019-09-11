import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import HeaderNotifications from "global/components/HeaderNotifications";
import BlurOnLocationChange from "hoc/blur-on-location-change";
import Utility from "global/components/utility";
import { FrontendModeContext } from "helpers/contexts";
import CustomHeader from "./CustomHeader";
import LibraryHeader from "./LibraryHeader";
import StandaloneHeader from "./StandaloneHeader";
import PressHeader from "./PressHeader";

export default class LayoutHeader extends PureComponent {
  static displayName = "Layout.Header";

  static propTypes = {
    visibility: PropTypes.object,
    location: PropTypes.object,
    authentication: PropTypes.object,
    notifications: PropTypes.object,
    commonActions: PropTypes.object,
    settings: PropTypes.object,
    pages: PropTypes.array
  };

  static defaultProps = {
    pages: []
  };

  static contextType = FrontendModeContext;

  constructor(props) {
    super(props);

    this.header = React.createRef();
  }

  get isStandalone() {
    return this.context.isStandalone;
  }

  get isLibrary() {
    return this.context.isLibrary;
  }

  render() {
    return (
      <>
        <BlurOnLocationChange
          tag="header"
          className="header-app header-app--sticky"
          location={this.props.location}
        >
          <Utility.SkipLink />
          <CustomHeader />
          <PressHeader />
          {this.context.isLibrary && <LibraryHeader {...this.props} />}
          <HeaderNotifications scope="global" />
        </BlurOnLocationChange>
        {this.context.isStandalone && (
          <BlurOnLocationChange
            tag="div"
            className="header-app header-app--static"
            location={this.props.location}
          >
            <StandaloneHeader {...this.props} />
          </BlurOnLocationChange>
        )}
      </>
    );
  }
}
