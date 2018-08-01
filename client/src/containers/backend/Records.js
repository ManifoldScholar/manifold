import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

export default class RecordsContainer extends PureComponent {
  static displayName = "RecordsContainer";

  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      {
        path: lh.link("backendRecordsMakers"),
        label: "Makers",
        key: "makers",
        entity: "maker",
        ability: "update"
      },
      {
        path: lh.link("backendRecordsUsers"),
        label: "Users",
        key: "users",
        entity: "user",
        ability: "update"
      },
      {
        path: lh.link("backendRecordsPages"),
        label: "Pages",
        key: "pages",
        entity: "page",
        ability: "update"
      },
      {
        path: lh.link("backendRecordsFeatures"),
        label: "Features",
        key: "features",
        entity: "user",
        ability: "update"
      }
    ];
  }

  render() {
    const skipId = "skip-to-records-nav";

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
          candidates={this.secondaryNavigationLinks()}
        />
        <div>
          <Utility.SkipLink skipId={skipId} />
          <Navigation.Secondary links={this.secondaryNavigationLinks()} />
          <section id={skipId} className="backend-detail">
            {childRoutes(this.props.route)}
          </section>
        </div>
      </HigherOrder.Authorize>
    );
  }
}
