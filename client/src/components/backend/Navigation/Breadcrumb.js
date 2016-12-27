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
        {this.props.breadcrumb.map((item, index) => {
          if (index === 0) {
            return (
              <Link key={index} to={item.path} className="back-link-primary">
                <i className="manicon manicon-arrow-left"></i>
                Back to: <span>{item.label}</span>
              </Link>
            );
          }
          return (
            <span key={index}>
                <span className="back-link-primary-delimiter">/</span>
                <Link to={item.path} className="back-link-primary-segment">
                  {item.label}
                </Link>
              </span>
          );
        })}
      </div>
    );
  }

}
