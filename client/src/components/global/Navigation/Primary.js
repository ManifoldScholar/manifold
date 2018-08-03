import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation } from "components/global";
import { HigherOrder } from "containers/global";
import { Link, withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";

export class NavigationPrimary extends PureComponent {
  static displayName = "Navigation.Primary";

  static propTypes = {
    links: PropTypes.array,
    location: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired
  };

  backendButton = props => {
    const currentUser = props.authentication.currentUser;
    const linkTo = props.mode === "backend" ? "frontend" : "backend";

    return (
      <Link className="button-mode" to={lh.link(linkTo)}>
        {this.backendButtonLabel(currentUser, props.mode)}
      </Link>
    );
  };

  backendButtonLabel(currentUser, mode) {
    if (!currentUser) return null;

    if (mode === "backend") {
      switch (currentUser.attributes.kind) {
        case "project_editor":
        case "project_resource_editor":
          return "Exit Editor Mode";
        case "project_author":
          return "Exit Author Mode";
        default:
          return "Exit Admin Mode";
      }
    } else {
      switch (currentUser.attributes.kind) {
        case "admin":
        case "editor":
        case "project_creator":
        case "marketeer":
          return "Enter Admin Mode";
        case "project_editor":
        case "project_resource_editor":
          return "Enter Editor Mode";
        case "project_author": // For now authors will not have access to the backend
        default:
          return null;
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <Navigation.Static backendButton={this.backendButton(this.props)} {...this.props} />
        <Navigation.Mobile backendButton={this.backendButton(this.props)} {...this.props} />
      </React.Fragment>
    )
  }
}

export default withRouter(NavigationPrimary);
