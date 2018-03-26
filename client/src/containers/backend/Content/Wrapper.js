import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectIfNoChildRouteMatches } from "helpers/router";

export class PagesWrapperContainer extends PureComponent {
  static displayName = "Pages.Wrapper";

  static mapStateToProps = (stateIgnored, ownPropsIgnored) => {
    return {};
  };

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
    return (
      <HigherOrder.Authorize
        entity="page"
        failureFatalError={{ detail: "You are not allowed to edit content." }}
        ability="create"
      >
        <RedirectIfNoChildRouteMatches
          route={this.props.route}
          to={lh.link("backendContentPages")}
        />

        <section className="backend-panel">
          <aside className="scrollable">
            <div className="wrapper">
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </div>
          </aside>
          <div className="container">
            <aside className="aside">
              <Navigation.Secondary links={this.secondaryNavigationLinks()} />
            </aside>
            <div className="panel">{childRoutes(this.props.route)}</div>
          </div>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(PagesWrapperContainer.mapStateToProps)(
  PagesWrapperContainer
);
