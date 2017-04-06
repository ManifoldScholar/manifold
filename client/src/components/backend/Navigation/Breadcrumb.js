import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router-dom';

export default class Breadcrumb extends PureComponent {

  static displayName = "Navigation.Breadcrumb";

  static propTypes = {
    links: PropTypes.array
  };

  render() {
    return (
      <div className="container flush">
        <nav className="breadcrumb-primary">
          <Link to={this.props.links[0].path} className="initial">
            <i className="manicon manicon-arrow-left"></i>
            {'Back to:'}
          </Link>
          <ul>
            {this.props.links.map((item, index) => {
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
