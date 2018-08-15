import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default class Breadcrumb extends PureComponent {
  static displayName = "Navigation.Breadcrumb";

  static propTypes = {
    links: PropTypes.array
  };

  render() {
    return (
      <nav className="breadcrumb-primary">
        <div className="container flush">
          <Link to={this.props.links[0].path} className="initial">
            <i className="manicon manicon-arrow-left" aria-hidden="true" />
          </Link>
          <ul>
            {this.props.links.map(item => {
              return (
                <li key={item.path}>
                  <Link to={item.path} className="back-link-primary-segment">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    );
  }
}
