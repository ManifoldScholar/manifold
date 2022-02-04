import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { childRoutes } from "helpers/router";
import Authorize from "hoc/Authorize";

export default class JournalsWrapper extends PureComponent {
  static propTypes = {
    route: PropTypes.object
  };

  render() {
    return (
      <Authorize
        ability="update"
        entity={["journal"]}
        failureFatalError={{
          body: "You are not allowed to manage journals."
        }}
      >
        <div>
          <main id="skip-to-main" className="backend-detail">
            {childRoutes(this.props.route)}
          </main>
        </div>
      </Authorize>
    );
  }
}
