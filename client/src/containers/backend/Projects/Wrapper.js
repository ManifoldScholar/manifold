import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

export default class ProjectsWrapper extends PureComponent {

  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      {
        path: lh.link("backendProjects"),
        label: "All Projects",
        key: "projects",
        entity: "project",
        ability: "update"
      }
    ];
  }

  render() {
    const skipId = "skip-to-projects-nav";

    return (
      <HigherOrder.Authorize
        ability="update"
        entity={["project"]}
        failureFatalError={{
          detail: "You are not allowed to manage projects."
        }}
      >
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
