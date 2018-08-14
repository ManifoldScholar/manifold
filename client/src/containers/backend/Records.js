import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

export default class RecordsContainer extends PureComponent {
  static displayName = "RecordsContainer";

  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const skipId = "skip-to-records-nav";
    const secondaryLinks = navigation.records();

    return (
      <HigherOrder.Authorize
        ability="update"
        entity={["user", "maker", "page", "feature"]}
        failureFatalError={{
          detail: "You are not allowed to manage records."
        }}
      >
        <RedirectToFirstMatch
          from={lh.link("backendRecords")}
          candidates={secondaryLinks}
        />
        <div>
          <Utility.SkipLink skipId={skipId} />
          <Navigation.Secondary links={secondaryLinks} />
          <section id={skipId} className="backend-detail">
            {childRoutes(this.props.route)}
          </section>
        </div>
      </HigherOrder.Authorize>
    );
  }
}
