import React, { PureComponent } from "react";
import withPluginReplacement from "hoc/with-plugin-replacement";
import Layout from "frontend/components/layout";

class HomeButtonNavigation extends PureComponent {
  static displayName = "Home.ButtonNavigation";

  showFollowing() {
    return true;
  }

  render() {
    return (
      <Layout.ButtonNavigation
        grayBg={false}
        showFollowing={this.showFollowing()}
      />
    );
  }
}

export default withPluginReplacement(
  HomeButtonNavigation,
  "Frontend.Components.Home.ButtonNavigation"
);
