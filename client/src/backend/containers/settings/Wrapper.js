import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Layout from "backend/components/layout";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";
import HeadContent from "global/components/HeadContent";

import Authorize from "hoc/Authorize";

export class SettingsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object,
    location: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const secondaryLinks = navigation.settings();
    const { t } = this.props;
    const subpage = this.props.location?.pathname
      .split("/")[3]
      ?.replace("-", "_");
    const subpageOverride = subpage === "properties" ? "settings" : null;

    return (
      <Authorize
        entity="settings"
        failureFatalError={{
          body: this.props.t("settings.unauthorized")
        }}
        ability="update"
      >
        <HeadContent
          title={`${t(`titles.${subpageOverride ?? subpage}`)} | ${t(
            "common.admin"
          )}`}
          appendDefaultTitle
        />
        <RedirectToFirstMatch
          route={"backendSettings"}
          candidates={secondaryLinks}
        />

        <section>
          <Layout.SecondaryNav links={secondaryLinks} />
          <main id="skip-to-main" tabIndex={-1} className="backend-detail">
            <div className="panel">{childRoutes(this.props.route)}</div>
          </main>
        </section>
      </Authorize>
    );
  }
}

export default withTranslation()(
  connect(SettingsWrapperContainer.mapStateToProps)(SettingsWrapperContainer)
);
