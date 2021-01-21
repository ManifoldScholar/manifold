import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";

export class AnalyticsWrapperContainer extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const { route } = this.props;

    return (
      <main id="skip-to-main">
        <h1 className="screen-reader-text">Dashboard</h1>
        <section>
          <div className="container">{childRoutes(route)}</div>
        </section>
      </main>
    );
  }
}

export default AnalyticsWrapperContainer;
