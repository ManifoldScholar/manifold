import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

export default class ProjectActivityUpdate extends Component {

  static propTypes = {
    update: PropTypes.object,
  };

  state = {
    containerPadding: {
      paddingTop: '0px',
      paddingBottom: '0px'
    }
  };

  componentDidUpdate = () => {
    const el = this.refs.activityContainer;
    const centerPadding = (el.parentNode.offsetHeight - el.offsetHeight) / 2;
    if (centerPadding > 0) {
      this.setState({containerPadding: {
        paddingTop: centerPadding + 'px',
        paddingBottom: centerPadding + 'px'
      }})
    }
  };

  renderUpdateContent = (update)=> {
    switch (update.type) {
      case 'comment':
        return (
          <div>
            <i className="manicon manicon-person-word-bubble"></i>
            <div className="activity-content">
              <p>
                {update.content}
              </p>
            </div>
            <Link to="#" className="activity-user">
              {update.user.display_name}
            </Link>
            {/* TODO: Include machine readable date-time */}
            <datetime className="activity-date">
              {update.date}
            </datetime>
          </div>
        );
      case 'file':
        return (
          <div>
            <i className="manicon manicon-cube-shine"></i>
            <h5 className="activity-title">
              {update.title}
            </h5>
            <datetime className="activity-date">
              {update.date}
            </datetime>
          </div>
        );
      case 'init':
        return (
          <div>
            <i className="manicon manicon-egg"></i>
            <h5 className="activity-title">
              {'Project Kickoff'}
              <span className="subtitle">
                {'A new Manifold project is born.'}
              </span>
            </h5>
            <datetime className="activity-date">
              {update.date}
            </datetime>
          </div>
        );
      case 'text':
        return (
          <div>
            <i className="manicon manicon-book-opening"></i>
            <h5 className="activity-title">
              {update.title}
              <span className="subtitle">
                {update.subtitle}
              </span>
            </h5>
            <datetime className="activity-date">
              {'Text added ' + update.date}
            </datetime>
          </div>
        );
      case 'twitter':
        return (
          <div>
            <i className="manicon manicon-twitter"></i>
            <Link to={'http://www.twitter.com/' + update.user} target="_blank" className="activity-user">
              {'@' + update.user}
            </Link>
            <div className="activity-content">
              <p>
                {update.content}
              </p>
            </div>
            {/* TODO: Include machine readable date-time */}
            <datetime className="activity-date">
              {update.date}
            </datetime>
          </div>
        );
      default:
        return (
          ''
        );
    }
  };

  render = () => {
    return (
        <div ref="activityContainer" style={this.state.containerPadding}>
          {this.renderUpdateContent(this.props.update)}
        </div>
    )
  };
}
