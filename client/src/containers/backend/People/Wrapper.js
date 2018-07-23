import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/backend";
import { HigherOrder } from "containers/global";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

export class UsersWrapperContainer extends PureComponent {
  static mapStateToProps = (stateIgnored, ownPropsIgnored) => {
    return {};
  };

  static displayName = "Users.Wrapper";

  static propTypes = {
    route: PropTypes.object
  };

  secondaryNavigationLinks() {
    return [
      {
        path: lh.link("backendPeopleMakers"),
        label: "Makers",
        key: "makers",
        entity: "maker",
        ability: "update"
      },
      {
        path: lh.link("backendPeopleUsers"),
        label: "Users",
        key: "users",
        entity: "user",
        ability: "update"
      }
    ];
  }

  render() {
    return (
      <HigherOrder.Authorize
        ability="update"
        entity={["user", "maker"]}
        failureFatalError={{
          detail: "You are not allowed to manage users and makers."
        }}
      >
        <RedirectToFirstMatch candidates={this.secondaryNavigationLinks()} />

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

export default connect(UsersWrapperContainer.mapStateToProps)(
  UsersWrapperContainer
);
