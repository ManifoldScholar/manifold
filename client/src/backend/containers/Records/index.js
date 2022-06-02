import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Navigation from "backend/components/navigation";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

import Authorize from "hoc/Authorize";

class RecordsContainer extends PureComponent {
  static displayName = "RecordsContainer";

  static propTypes = {
    route: PropTypes.object,
    t: PropTypes.func
  };

  render() {
    const secondaryLinks = navigation.records();

    return (
      <Authorize
        ability="update"
        entity={["user", "maker", "page", "feature", "exportTarget"]}
        failureFatalError={{
          body: this.props.t("backend.records.unauthorized")
        }}
      >
        <RedirectToFirstMatch
          from={lh.link("backendRecords")}
          candidates={secondaryLinks}
        />
        <div>
          <Navigation.Secondary links={secondaryLinks} />
          <main id="skip-to-main" tabIndex={-1} className="backend-detail">
            {childRoutes(this.props.route)}
          </main>
        </div>
      </Authorize>
    );
  }
}

export default withTranslation()(RecordsContainer);
