import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

export class RecordsContainer extends PureComponent {
  static mapStateToProps = (stateIgnored, ownPropsIgnored) => {
    return {};
  };

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
    const skipId = "skip-to-people-panel";

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
          <Navigation.Secondary links={this.secondaryNavigationLinks()} inline scrollable />
          <section className="container">
            <div id={skipId} className="panel">
              {childRoutes(this.props.route)}
            </div>
          </section>
        </div>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(RecordsContainer.mapStateToProps)(
  RecordsContainer
);
