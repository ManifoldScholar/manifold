import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class UtilityBackLinkSecondary extends Component {

  static displayName = "Utility.BackLinkSecondary";

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
        <Link to={this.props.link} className="back-link-secondary">
          <i className="manicon manicon-arrow-round-left"></i>
          <div>
            <span className="back-text">{this.props.backText}</span>
              <span className="project-title">
                {this.props.title}
              </span>
          </div>
        </Link>
      </div>
    );
  }
}
