import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Static from "global/components/navigation/Static";
import Mobile from "global/components/navigation/Mobile";
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
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired,
    exact: PropTypes.bool,
    desktopStyle: PropTypes.object,
    mobileStyle: PropTypes.object,
    t: PropTypes.func
  };

  static defaultProps = {
    exact: false
  };

  backendButtonLabel(currentUser, mode) {
    if (!currentUser) return null;
    const t = this.props.t;

    if (mode === "backend") {
      switch (currentUser.attributes.kind) {
        case "project_editor":
        case "project_resource_editor":
          return t("navigation.backend.exit_editor");
        case "project_author":
          return t("navigation.backend.exit_author");
        default:
          return t("navigation.backend.exit_admin");
      }
    } else {
      switch (currentUser.attributes.kind) {
        case "admin":
        case "editor":
        case "project_creator":
        case "marketeer":
          return t("navigation.backend.enter_admin");
        case "project_editor":
        case "project_resource_editor":
          return t("navigation.backend.enter_editor");
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
          {this.backendButtonLabel(currentUser, this.props.mode)}
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

export default withTranslation()(withRouter(NavigationPrimary));
