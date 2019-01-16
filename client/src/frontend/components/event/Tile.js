import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormattedDate from "global/components/FormattedDate";
import { Link } from "react-router-dom";
import Utility from "global/components/utility";

export default class Tile extends Component {
  static displayName = "Event.Tile";

  static propTypes = {
    hideLink: PropTypes.bool,
    itemClass: PropTypes.string,
    destroyCallback: PropTypes.func,
    visible: PropTypes.bool,
    tileClass: PropTypes.string,
    header: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.any,
    preAttribution: PropTypes.any,
    content: PropTypes.any,
    postAttribution: PropTypes.any,
    date: PropTypes.string,
    dateFormat: PropTypes.string,
    linkHref: PropTypes.string,
    linkTarget: PropTypes.string
  };

  static defaultProps = {
    linkTarget: "_self",
    hideLink: false,
    visible: true,
    itemClass: ""
  };

  renderInnerContent() {
    const {
      header,
      icon,
      title,
      subtitle,
      preAttribution,
      content,
      postAttribution,
      date,
      dateFormat
    } = this.props;

    const baseClass = "event-tile";

    return (
      <div className={`${baseClass}__inner`}>
        {icon && (
          <Utility.IconComposer
            icon={icon}
            size={48}
            iconClass={`${baseClass}__icon`}
          />
        )}
        {header && <div className={`${baseClass}__header`}>{header}</div>}
        {title && (
          <h5
            className={`${baseClass}__title`}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}
        {subtitle && (
          <span className={`${baseClass}__subtitle`}>{subtitle}</span>
        )}
        {preAttribution && (
          <div className={`${baseClass}__user`}>{preAttribution}</div>
        )}
        {content && <div className={`${baseClass}__content`}>{content}</div>}
        {postAttribution && (
          <div className={`${baseClass}__user`}>{postAttribution}</div>
        )}
        {date && (
          <span className={`${baseClass}__footer`}>
            <FormattedDate format={dateFormat} date={date} />
          </span>
        )}
      </div>
    );
  }

  renderLinkWrapper(wrapperClass) {
    const { linkHref, linkTarget } = this.props;

    if (!linkHref) return null;
    if (linkTarget && linkTarget !== "_self") {
      return (
        <a
          href={linkHref}
          target={linkTarget}
          rel="noopener noreferrer"
          className={wrapperClass}
        >
          {this.renderInnerContent()}
        </a>
      );
    }

    return (
      <Link to={linkHref} className={wrapperClass}>
        {this.renderInnerContent()}
      </Link>
    );
  }

  render() {
    if (!this.props.visible) return null;
    const tileClass = classNames("event-tile", this.props.tileClass);

    return (
      <li className={this.props.itemClass}>
        {!this.props.hideLink ? (
          this.renderLinkWrapper(tileClass)
        ) : (
          <div className={tileClass}>{this.renderInnerContent()}</div>
        )}
        {this.props.destroyCallback && (
          <div
            className="utility"
            data-id={"destroy"}
            onClick={this.props.destroyCallback}
            role="button"
            tabIndex="0"
          >
            <i className="manicon manicon-trashcan" aria-hidden="true" />
            <span className="screen-reader-text">Delete Event</span>
          </div>
        )}
      </li>
    );
  }
}
