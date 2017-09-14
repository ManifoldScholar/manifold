import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import { renderRoutes } from "helpers/routing";

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
      { path: lh.link("backendContentPages"), label: "Pages", key: "pages" },
      {
        path: lh.link("backendContentFeatures"),
        label: "Features",
        key: "features"
      }
    ];
  }

  render() {
    return (
      <div>
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
            <div className="panel">
              {renderRoutes(this.props.route.routes)}
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default connect(PagesWrapperContainer.mapStateToProps)(
  PagesWrapperContainer
);
