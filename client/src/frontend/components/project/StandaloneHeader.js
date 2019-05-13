import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import { commonActions } from "actions/helpers";
import { select, isLoaded } from "utils/entityUtils";
import connectAndFetch from "utils/connectAndFetch";
import { subjectsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import Navigation from "global/components/navigation";
import HeaderNotifications from "global/components/HeaderNotifications";
import LinkBar from "frontend/components/utility/LinkBar";
import BodyClass from "hoc/body-class";

const { request } = entityStoreActions;

class StandaloneHeader extends PureComponent {
  static displayName = "Project.StandaloneHeader";

  static fetchData = (getState, dispatch) => {
    if (!isLoaded(requests.gPages, getState())) {
      const subjects = request(
        subjectsAPI.index({ used: true }, {}, true),
        requests.feSubjects,
        { oneTime: true }
      );
      const promises = [];
      const subjectsRes = dispatch(subjects);
      if (subjectsRes) promises.push(subjectsRes.promise);
      return Promise.all(promises);
    }
  };

  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      notifications: state.notifications,
      settings: select(requests.settings, state.entityStore)
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    notifications: PropTypes.object,
    settings: PropTypes.object,
    project: PropTypes.object.isRequired,
    full: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  get darkMode() {
    return this.props.project.attributes.darkMode;
  }

  get backgroundImage() {
    return this.props.project.attributes.heroStyles;
  }

  get hasBackgroundImage() {
    return (
      this.backgroundImage.mediumLandscape &&
      this.backgroundImage.largeLandscape
    );
  }

  get darkTheme() {
    return !!(this.hasBackgroundImage || this.darkMode);
  }

  get fullTheme() {
    return this.props.full;
  }

  get title() {
    return this.props.project.attributes.titleFormatted;
  }

  get subtitle() {
    return this.props.project.attributes.subtitleFormatted;
  }

  get linkBarUrl() {
    return "#";
  }

  get linkBarLabel() {
    return "University of Minnesota Press";
  }

  get linkBarBgColor() {
    return "#7B2E00";
  }

  get showLinkBar() {
    return this.linkBarUrl && this.linkBarLabel;
  }

  get projectSlug() {
    return this.props.project.attributes.slug;
  }

  get bodyClasses() {
    return classNames({
      "browse--standalone": true
    });
  }

  get headerClasses() {
    return classNames({
      "header-app": true,
      "header-app--standalone": true,
      "header-app--standalone-light": !this.darkTheme,
      "header-app--standalone-dark-full": this.darkTheme && this.fullTheme,
      "header-app--standalone-dark-simple": this.darkTheme && !this.fullTheme,
      "header-app--with-link-bar": this.showLinkBar
    });
  }

  get containerClasses() {
    return classNames({
      "header-container": true,
      "header-container--standalone": true,
      "header-container--standalone-full": this.fullTheme,
      "header-container--standalone-simple": !this.fullTheme
    });
  }

  renderHeading() {
    if (!this.title && !this.subtitle) return null;

    return (
      <header className="header-app__standalone-header">
        <Link
          to={lh.link("frontendProjectDetail", this.projectSlug)}
          className="header-app__standalone-text-link"
        >
          {this.title && (
            <h1
              className="header-app__standalone-title"
              dangerouslySetInnerHTML={{ __html: this.title }}
            />
          )}
          {this.subtitle && (
            <div
              className="header-app__standalone-subtitle"
              dangerouslySetInnerHTML={{ __html: this.subtitle }}
            />
          )}
        </Link>
      </header>
    );
  }

  render() {
    const offset = get(this.props, "settings.attributes.theme.headerOffset");
    const navStyle = offset
      ? { position: "relative", top: parseInt(offset, 10) }
      : {};

    return (
      <BodyClass className={this.bodyClasses}>
        <header className={this.headerClasses}>
          {this.showLinkBar && (
            <LinkBar
              url={this.linkBarUrl}
              label={this.linkBarLabel}
              bgColor={this.linkBarBgColor}
            />
          )}
          <div className={this.containerClasses}>
            {this.renderHeading()}
            {
              <Navigation.Primary
                desktopStyle={navStyle}
                commonActions={this.commonActions}
                authentication={this.props.authentication}
                visibility={this.props.visibility}
                mode="frontend"
                standaloneMode
                darkTheme={this.darkTheme}
              />
            }
          </div>

          <div className="header-border" />
          <HeaderNotifications scope="global" />
        </header>
      </BodyClass>
    );
  }
}

export default connectAndFetch(StandaloneHeader);
