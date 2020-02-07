import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

import Authorize from "hoc/authorize";

export default class RecordsContainer extends PureComponent {
  static displayName = "RecordsContainer";

  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const secondaryLinks = navigation.records();

    return (
      <Authorize
        ability="update"
        entity={["user", "maker", "page", "feature", "exportTarget"]}
        failureFatalError={{
          body: "You are not allowed to manage records."
        }}
      >
        <RedirectToFirstMatch
          from={lh.link("backendRecords")}
          candidates={secondaryLinks}
        />
        <div>
          <Navigation.Secondary links={secondaryLinks} />
          <section className="backend-detail">
            {childRoutes(this.props.route)}
          </section>
        </div>
      </Authorize>
    );
  }
}
