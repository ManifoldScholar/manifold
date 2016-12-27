import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';

export default class Breadcrumb extends PureComponent {

  static displayName = "Navigation.Breadcrumb";

  static propTypes = {
    breadcrumb: PropTypes.array
  };

  render() {
    return (
      <div className="container flush">
        <nav className="breadcrumb-primary">
          <i className="manicon manicon-arrow-left"></i>
          {'Back to:'}
          <ul>
            {this.props.breadcrumb.map((item, index) => {
              return (
                <li key={index}>
                  <Link to={item.path} className="back-link-primary-segment">
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    );
  }
}
