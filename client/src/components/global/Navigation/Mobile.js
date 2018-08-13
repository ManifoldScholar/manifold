import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Navigation, Search, Avatar } from "components/global";
import { HigherOrder } from "containers/global";
import { HigherOrder as HigherOrderComponent } from "components/global";
import { NavLink, withRouter } from "react-router-dom";
import classnames from "classnames";
import get from "lodash/get";
import hasIn from "lodash/hasIn";

export class NavigationMobile extends PureComponent {
  static displayName = "Navigation.Mobile";

  static propTypes = {
    links: PropTypes.array,
    location: PropTypes.object,
    authentication: PropTypes.object,
    visibility: PropTypes.object,
    commonActions: PropTypes.object.isRequired,
    backendButton: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
    mode: PropTypes.oneOf(["backend", "frontend"]).isRequired
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
  }

  initialState(props) {
    const ids = props.links.map(link => link.key);
    const state = { open: false };
    ids.forEach(id => state[id] = false);

    return state;
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.open) return null;
    if (prevProps.location.pathname === this.props.location.pathname) return null;
    this.setState(this.initialState(this.props));
  }

  toggleNavItem = event => {
    const label = event.target.getAttribute("id");
    if (!label) return null;

    this.setState({ [label]: !this.state[label] });
  };

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  handleProfileClick = event => {
    event.preventDefault();
    this.props.commonActions.toggleSignInUpOverlay();
    this.toggleOpen();
  };

  handleLogOutClick = event => {
    event.preventDefault();
    this.props.commonActions.logout();
    this.toggleOpen();
  };

  getSelected(props) {
    const { pathname } = props.location;
    return props.links.find(link => link.path === pathname);
  }

  displayNickname = () => {
    if (this.state.nickname) return this.state.nickname;
    if (hasIn(this.props.authentication, "currentUser.attributes.nickname")) {
      return this.props.authentication.currentUser.attributes.nickname;
    }
    if (hasIn(this.props.authentication, "currentUser.attributes.firstName")) {
      return this.props.authentication.currentUser.attributes.firstName;
    }
  };

  renderItem(link) {
    const children = link.children || [];

    if (children.length === 0) return (
      <li key={link.key}>
        <NavLink to={link.path} activeClassName="active" isActive={link.isActive}>
          {link.label}
        </NavLink>
      </li>
    );

    const open = this.state[link.key] || false;

    const classes = classnames({
      nested: children.length > 0,
      open: open,
      active: this.getSelected(this.props) === link
    });

    const arrowDir = open ? "up" : "down";

    return (
      <li key={link.key} onClick={this.toggleNavItem} className={classes} id={link.key}>
        <i className={`manicon manicon-caret-${arrowDir}`} />
        {link.label}

        <ul>
          {children.map(child => this.renderItem(child))}
        </ul>
      </li>
    );
  }

  renderUserLinks(props) {
    if (!props.authentication.authenticated) return (
      <div className="user-links">
        <ul>
          <li>
            <Avatar />
            <button onClick={this.handleProfileClick}>
              {"Login"}
            </button>
          </li>
        </ul>
      </div>
    );

    return (
      <div className="user-links">
        <ul>
          <li>
            <Avatar
              url={get(
                this.props.authentication,
                "currentUser.attributes.avatarStyles.smallSquare"
              )}
            />
            {this.displayNickname()}
          </li>
          <li>
            <button onClick={this.handleProfileClick}>
              <i
                className="manicon manicon-person-pencil-simple"
                aria-hidden="true"
              />
              {"Edit Profile"}
            </button>
          </li>
          <li>
            <button onClick={this.handleLogOutClick}>
              <i
                className="manicon manicon-circle-arrow-out-right-long"
                aria-hidden="true"
              />
              {"Logout"}
            </button>
          </li>
          <li>
            {this.props.backendButton}
          </li>
        </ul>
      </div>
    );
  }

  renderSearch(props) {
    if (props.mode !== "frontend") return null;

    return (
      <Search.Menu.Body
        searchType={"frontend"}
        visibility={{ search: true }}
      />
    );
  }

  renderPrimaryLinks(props) {
    if (!this.state.open) return null;

    return (
      <HigherOrderComponent.BodyClass className={"no-scroll"}>
        <React.Fragment>
          <ul className="primary-links">
            {props.links.map(link => {
              if (link.ability)
                return (
                  <HigherOrder.Authorize
                    key={`${link.key}-wrapped`}
                    entity={link.entity}
                    ability={link.ability}
                  >
                    {this.renderItem(link)}
                  </HigherOrder.Authorize>
                );
              return this.renderItem(link);
            })}
            <li>
              {this.renderSearch(props)}
            </li>
          </ul>
          {this.renderUserLinks(props)}
        </React.Fragment>
      </HigherOrderComponent.BodyClass>
    );
  }

  render() {
    const selected = this.getSelected(this.props);
    const label = selected ? selected.label : null;
    const navClasses = classnames({
      "nested-nav": true,
      "hide-75": true,
      open: this.state.open
    });
    const triggerClass = this.state.open ? "x" : "bars-parallel-horizontal";

    return (
      <nav className={navClasses}>
        <div className="selected">
          {label}
        </div>
        {this.renderPrimaryLinks(this.props)}
        <i className={`manicon manicon-${triggerClass}`} onClick={this.toggleOpen} />
      </nav>
    )
  }
}

export default withRouter(NavigationMobile);
