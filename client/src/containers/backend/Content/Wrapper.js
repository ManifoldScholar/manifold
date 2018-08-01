import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

export class PagesWrapperContainer extends PureComponent {
  static mapStateToProps = (stateIgnored, ownPropsIgnored) => {
    return {};
  };

  static displayName = "Pages.Wrapper";

  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      {
        path: lh.link("backendContentPages"),
        label: "Pages",
        key: "pages",
        entity: "page",
        ability: "update"
      },
      {
        path: lh.link("backendContentFeatures"),
        label: "Features",
        key: "features",
        entity: "feature",
        ability: "update"
      }
    ];
  }

  render() {
    const skipId = "skip-to-content-panel";

    return (
      <HigherOrder.Authorize
        entity={["page", "feature"]}
        failureFatalError={{ detail: "You are not allowed to edit content." }}
        ability="create"
      >
        <RedirectToFirstMatch
          from={lh.link("backendContent")}
          candidates={this.secondaryNavigationLinks()}
        />

        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Utility.SkipLink skipId={skipId} />
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Utility.SkipLink skipId={skipId} />
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </aside>
            <div id={skipId} className="panel">
              {childRoutes(this.props.route)}
            </div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(PagesWrapperContainer.mapStateToProps)(
  PagesWrapperContainer
);
