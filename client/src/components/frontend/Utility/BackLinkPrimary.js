import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';

export default class UtilityBackLinkPrimary extends Component {

  static displayName = "Utility.BackLinkPrimary";

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
      <Link to={this.props.link} className="back-link-primary full">
        <div className="container flush">
          <i className="manicon manicon-arrow-left"></i>
          {this.props.backText}
            <span>
              {this.props.title}
            </span>
        </div>
      </Link>
    );
  }
}
