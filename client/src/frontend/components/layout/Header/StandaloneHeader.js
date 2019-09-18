import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import get from "lodash/get";
import { commonActions } from "actions/helpers";
import connectAndFetch from "utils/connectAndFetch";
import Navigation from "global/components/navigation";
import HeaderNotifications from "global/components/HeaderNotifications";
import { FrontendModeContext } from "helpers/contexts";
import { throttle } from "lodash";
import lh from "helpers/linkHandler";
import { Link } from "react-router-dom";
import SetCSSProperty from "global/components/utility/SetCSSProperty";

class StandaloneHeader extends PureComponent {
  static displayName = "Layout.StandaloneHeader";

  static mapStateToProps = state => {
    return {
      authentication: state.authentication,
      visibility: state.ui.transitory.visibility,
      notifications: state.notifications
    };
  };

  static propTypes = {
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    notifications: PropTypes.object,
    settings: PropTypes.object,
    alwaysVisible: PropTypes.bool
  };

  static defaultProps = {
    alwaysVisible: false
  };

  static contextType = FrontendModeContext;

  constructor(props) {
    super(props);
    this.shimRef = React.createRef();
    this.fixedRef = React.createRef();
    this.breakpoint = 620;
    this.resizeId = null;

    this.commonActions = commonActions(props.dispatch);
    this.state = {
      sticky: false,
      scroll: 0,
      direction: "down",
      log: null,
      mobile: window.innerWidth <= this.breakpoint
    };

    this.throttleScroll = throttle(this.handleScroll, 250, {
      leading: true,
      trailing: true
    }).bind(this);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.throttleScroll);
    window.addEventListener("resize", this.handleResize);
    this.setShimHeight();
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.throttleScroll);
    window.removeEventListener("resize", this.handleResize);
  }

  componentDidUpdate() {
    this.setShimHeight();
  }

  setShimHeight() {
    if (!this.fixedRef.current || !this.shimRef.current) return;
    const fixedHeight = this.fixedRef.current.offsetHeight;
    this.shimRef.current.style.height = `${fixedHeight}px`;
  }

  maybeLog(direction) {
    // Set a scroll log on direction change
    // Note that this.state.direction is the old direction
    let log = this.state.log;
    if (this.state.direction !== direction) {
      log = this.getScrollTop();
    }

    return log;
  }

  getScrollTop() {
    let scrollTop = 0;
    if (window.pageYOffset !== undefined) {
      scrollTop = window.pageYOffset;
    } else {
      scrollTop = (
        document.documentElement ||
        document.body.parentNode ||
        document.body
      ).scrollTop;
    }
    return scrollTop;
  }

  handleScroll() {
    const direction = this.getScrollTop() > this.state.scroll ? "down" : "up";
    const log = this.maybeLog(direction);
    const state = {
      direction,
      log,
      scroll: this.getScrollTop()
    };
    state.sticky = state.scroll > 50;
    this.setState(state);
  }

  handleResize = () => {
    if (!this.context.isProjectHomepage) return null;

    if (this.resizeId) {
      window.cancelAnimationFrame(this.resizeId);
    }

    this.resizeId = window.requestAnimationFrame(() => {
      this.setState({ mobile: window.innerWidth <= this.breakpoint });
    });
  };

  get darkMode() {
    return this.context.project.darkMode;
  }

  get backgroundImage() {
    return this.context.project.heroStyles;
  }

  get lightTheme() {
    if (this.alwaysVisible && !this.darkMode) return true;
    if (!this.darkMode) return true;
    return false;
  }

  get title() {
    return this.context.project.titleFormatted;
  }

  get subtitle() {
    return this.context.project.subtitleFormatted;
  }

  get projectSlug() {
    return this.context.project.slug;
  }

  get alwaysVisible() {
    if (!this.context.isProjectHomepage) return true;
    return this.props.alwaysVisible;
  }

  get projectUrl() {
    return lh.link("frontendProjectDetail", this.context.project.slug);
  }

  render() {
    const { sticky, mobile } = this.state;
    const visible = (sticky && !this.alwaysVisible) || mobile;
    const hidden = !sticky && !this.alwaysVisible && !mobile;

    const wrapperClasses = classNames({
      "standalone-header": true,
      "standalone-header--visible": visible,
      "standalone-header--hidden": hidden,
      "standalone-header--light": this.lightTheme,
      "standalone-header--dark": !this.lightTheme
    });

    const innerClasses = classNames({
      "standalone-header__inner": true
    });

    const headingClasses = classNames({
      "standalone-header__header": true
    });

    const offset = get(this.props, "settings.attributes.theme.headerOffset");
    const navStyle = offset
      ? { position: "relative", top: parseInt(offset, 10) }
      : {};

    return (
      <>
        <div className={wrapperClasses}>
          <SetCSSProperty
            measurement="height"
            propertyName="--standalone-header-height"
          >
            <div className={innerClasses} ref={this.fixedRef}>
              <div className={headingClasses} aria-hidden={hidden}>
                <Link
                  to={this.projectUrl}
                  className="standalone-header__title-link"
                >
                  {this.title && (
                    <div
                      className="standalone-header__title"
                      dangerouslySetInnerHTML={{ __html: this.title }}
                    />
                  )}
                  {this.subtitle && (
                    <div
                      className="standalone-header__subtitle"
                      dangerouslySetInnerHTML={{ __html: this.subtitle }}
                    />
                  )}
                </Link>
              </div>
              <Navigation.Primary
                desktopStyle={navStyle}
                commonActions={this.commonActions}
                authentication={this.props.authentication}
                visibility={this.props.visibility}
                mode="frontend"
                standaloneMode
                darkTheme={!this.lightTheme}
              />
            </div>
          </SetCSSProperty>
        </div>
        {this.alwaysVisible && (
          <div className="standalone-header__shim" ref={this.shimRef} />
        )}
        <HeaderNotifications scope="global" />
      </>
    );
  }
}

export default connectAndFetch(StandaloneHeader);
