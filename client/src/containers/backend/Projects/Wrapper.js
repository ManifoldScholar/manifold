import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import navigation from "helpers/router/navigation";

export default class ProjectsWrapper extends PureComponent {

  static propTypes = {
    route: PropTypes.object
  };

  render() {
    const skipId = "skip-to-projects-nav";
    const secondaryLinks = navigation.projects();

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
          <Navigation.Secondary links={secondaryLinks} />
          <section id={skipId} className="backend-detail">
            {childRoutes(this.props.route)}
          </section>
        </div>
      </HigherOrder.Authorize>
    );
  }
}
