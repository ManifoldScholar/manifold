import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Navigation from "backend/components/navigation";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";
import navigation from "helpers/router/navigation";
import Authorize from "hoc/authorize";

export default class ProjectsWrapper extends PureComponent {
  static propTypes = {
    route: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  render() {
    const secondaryLinks = navigation.projects();

    return (
      <Authorize
        ability="update"
        entity={["project"]}
        failureFatalError={{
          body: "You are not allowed to manage projects."
        }}
      >
        <div>
          <RedirectToFirstMatch
            from={lh.link("backendProjects")}
            candidates={secondaryLinks}
          />
          <Navigation.Secondary links={secondaryLinks} />
          <main id="skip-to-main" className="backend-detail">
            {childRoutes(this.props.route)}
          </main>
        </div>
      </Authorize>
    );
  }
}
