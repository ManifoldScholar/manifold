import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class BackLinkPrimary extends Component {

  static defaultProps = {
    backText: 'Back to Project'
  };

  static propTypes = {
    link: PropTypes.string,
    backText: PropTypes.string,
    title: PropTypes.string
  };

  render() {
    return (
      <div className="container flush">
        <Link to={this.props.link} className="back-link-primary">
          <i className="manicon manicon-arrow-left"></i>
          {this.props.backText}
            <span>
              {this.props.title}
            </span>
        </Link>
      </div>
    );
  }
}
