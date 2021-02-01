import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Static from "global/components/navigation/Static";
import Mobile from "global/components/navigation/Mobile";
import { Link, withRouter } from "react-router-dom";
import lh from "helpers/linkHandler";
import T from "global/components/Translate";

export class NavigationPrimary extends PureComponent {
  static displayName = "Navigation.Primary";

  static propTypes = {
    links: PropTypes.array,
    location: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
    exact: PropTypes.bool,
    desktopStyle: PropTypes.object,
    mobileStyle: PropTypes.object
  };

  static defaultProps = {
    exact: false
  };

  backendButtonLabel(currentUser, mode) {
    if (!currentUser) return null;

    if (mode === "backend") {
      switch (currentUser.attributes.kind) {
        case "project_editor":
        case "project_resource_editor":
          return "exit-editor-mode";
        case "project_author":
          return "exit-author-mode";
        default:
          return "exit-admin-mode";
      }
    } else {
      switch (currentUser.attributes.kind) {
        case "admin":
        case "editor":
        case "project_creator":
        case "marketeer":
          return "enter-admin-mode";
        case "project_editor":
        case "project_resource_editor":
          return "enter-editor-mode";
        case "project_author": // For now authors will not have access to the backend
        default:
          return null;
      }
    }
  }

  render() {
    const currentUser = this.props.authentication.currentUser;

    const linkTo = this.props.mode === "backend" ? "frontend" : "backend";
    const backendButtonLabel = this.backendButtonLabel(
      currentUser,
      this.props.mode
    );
    const backendButton =
      backendButtonLabel && currentUser ? (
        <Link className="mode-button" to={lh.link(linkTo)}>
          <T
            translate={this.backendButtonLabel(currentUser, this.props.mode)}
          />
        </Link>
      ) : null;

    return (
      <>
        <Static
          backendButton={backendButton}
          {...this.props}
          style={this.props.desktopStyle}
        />
        <Mobile
          backendButton={backendButton}
          {...this.props}
          style={this.props.mobileStyle}
          mode={this.props.mode}
        />
      </>
    );
  }
}

export default withRouter(NavigationPrimary);
