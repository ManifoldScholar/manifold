import React, { Component } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import FormattedDate from "components/global/FormattedDate";
import { Link } from "react-router-dom";

export default class Tile extends Component {
  static displayName = "Event.Tile";

  static propTypes = {
    hideLink: PropTypes.bool,
    itemClass: PropTypes.string,
    destroyCallback: PropTypes.func,
    visible: PropTypes.bool,
    tileClass: PropTypes.string,
    iconClass: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.any,
    preAttribution: PropTypes.any,
    content: PropTypes.any,
    postAttribution: PropTypes.any,
    date: PropTypes.string,
    dateFormat: PropTypes.string,
    datePrefix: PropTypes.string,
    linkHref: PropTypes.string,
    linkTarget: PropTypes.string,
    linkPrompt: PropTypes.string
  };

  static defaultProps = {
    linkTarget: "_self",
    hideLink: false,
    visible: true,
    itemClass: ""
  };

  renderLink() {
    const { linkHref, linkPrompt, linkTarget } = this.props;
    if (!linkHref) return null;
    if (linkTarget && linkTarget !== "_self") {
      return (
        <a href={linkHref} target={linkTarget}>
          {linkPrompt}
          <i className="manicon manicon-arrow-long-right" />
        </a>
      );
    }
    return (
      <Link to={linkHref}>
        {linkPrompt}
        <i className="manicon manicon-arrow-long-right" />
      </Link>
    );
  }

  render() {
    if (!this.props.visible) return null;
    const tileClass = classnames("event-tile", this.props.tileClass);

    return (
      <li className={this.props.itemClass}>
        <div className={tileClass}>
          <div className="event-data">
            <div>
              {this.props.iconClass
                ? <i className={this.props.iconClass} />
                : null}
              {this.props.title
                ? <h5
                    className="event-title"
                    dangerouslySetInnerHTML={{ __html: this.props.title }}
                  />
                : null}
              {this.props.subtitle
                ? <span className="event-subtitle">
                    {this.props.subtitle}
                  </span>
                : null}
              {this.props.preAttribution
                ? <div className="event-user">
                    {this.props.preAttribution}
                  </div>
                : null}
              {this.props.content
                ? <div className="event-content">
                    {this.props.content}
                  </div>
                : null}
              {this.props.postAttribution
                ? <div className="event-user">
                    {this.props.postAttribution}
                  </div>
                : null}
              {this.props.date
                ? <datetime className="event-date">
                    <FormattedDate
                      prefix={this.props.datePrefix}
                      format={this.props.dateFormat}
                      date={this.props.date}
                    />
                  </datetime>
                : null}
            </div>
          </div>
          {!this.props.hideLink
            ? <div className="event-prompt">
                {this.renderLink()}
              </div>
            : null}
        </div>
        {this.props.destroyCallback
          ? <div
              className="utility"
              data-id={"destroy"}
              onClick={this.props.destroyCallback}
            >
              <i className="manicon manicon-trashcan" />
            </div>
          : null}
      </li>
    );
  }
}
