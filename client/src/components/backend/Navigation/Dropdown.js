import React, { Component } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "containers/global";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import classnames from "classnames";

export class NavigationDropdown extends Component {
  static displayName = "Navigation.Dropdown";

  static propTypes = {
    links: PropTypes.array,
    classNames: PropTypes.string,
    location: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  toggleOpen = () => {
    this.setState({ open: !this.state.open });
  };

  getSelected(props) {
    const { pathname } = props.location;
    return props.links.find(link => link.path === pathname);
  }

  renderItem(link) {
    return (
      <li key={link.key}>
        <NavLink to={link.path} activeClassName="active">
          {link.label}
        </NavLink>
      </li>
    );
  }

  renderStatic(props) {
    const selected = this.getSelected(props);
    const label = selected ? selected.label : "menu";

    return (
      <nav className={`dropdown-nav static ${props.classNames}`}>
        <div className="selected">
          {label}
        </div>
      </nav>
    )
  }

  renderMenu(props) {
    const selected = this.getSelected(props);
    const navClasses = classnames({
      "dropdown-nav": true,
      open: this.state.open
    });
    const label = selected ? selected.label : "menu";

    return (
      <nav className={`${navClasses} ${this.props.classNames}`} onClick={this.toggleOpen}>
        <div className="selected">
          {label}
          <i className="manicon manicon-caret-up" />
        </div>
        <ul>
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
        </ul>
      </nav>
    )
  }

  render() {
    return (
      <HigherOrder.BlurOnLocationChange location={this.props.location}>
        {this.props.links.length > 1
          ? this.renderMenu(this.props)
          : this.renderStatic(this.props)
        }
      </HigherOrder.BlurOnLocationChange>
    );
  }
}

export default withRouter(NavigationDropdown);
