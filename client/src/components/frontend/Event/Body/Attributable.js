import React, { Component, PropTypes } from 'react';
import FormattedDate from 'components/global/FormattedDate';

export default class EventBodyAttributable extends Component {

  static displayName = "Event.Body.Attributable";

  static propTypes = {
    event: PropTypes.object,
    icon: PropTypes.string,
  };

  componentDidMount() {
    import(/* webpackChunkName: "autolinker" */ 'autolinker').then((autolinker) => {
      this.setState({ autolinker });
    });
  }

  autoLink(excerpt) {
    if (!this.state.autolinker) return { __html: "" };
    const options = {
      mention: "twitter",
      hashtag: "twitter"
    };
    return {
      __html: this.state.autolinker.link(excerpt, options)
    };
  }

  render() {
    const attr = this.props.event.attributes;
    const iconClass = 'manicon manicon-' + this.props.icon;

    return (
      <div className="event-data">
        {/* Event-data requires a classless empty div for vertical alignment */}
        <div>
          <i className={iconClass}></i>
          <div className="event-user">
            <a href={`https://twitter.com/${attr.attributionIdentifier}`}>
              {'@' + attr.attributionIdentifier}
            </a>
          </div>
          <div className="event-content">
            <p dangerouslySetInnerHTML={this.autoLink(attr.excerpt)} />
          </div>
          <datetime className="event-date">
            <FormattedDate
              format="MMMM Do, YYYY"
              date={attr.createdAt}
            />
          </datetime>
        </div>
      </div>
    );
  }
}
