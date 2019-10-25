import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import FormattedDate from "global/components/FormattedDate";
import Utility from "global/components/utility";
import { withRouter } from "react-router-dom";

export class EventTile extends Component {
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
    linkTarget: PropTypes.string,
    history: PropTypes.object
  };

  static defaultProps = {
    linkTarget: "_self",
    hideLink: false,
    visible: true,
    itemClass: ""
  };

  get hasLink() {
    const { linkHref, hideLink } = this.props;
    return !hideLink && linkHref;
  }

  handleTileClick = event => {
    if (event.target.href) return;
    if (!this.hasLink) return;
    const { linkHref, linkTarget } = this.props;
    if (linkTarget !== "_self" && window)
      return window.open(linkHref, "_blank");
    if (this.props.history) this.props.history.push(linkHref);
  };

  render() {
    if (!this.props.visible) return null;

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
    const tileClass = classNames(baseClass, this.props.tileClass, {
      [`${baseClass}--linked`]: this.hasLink
    });

    return (
      <div className={this.props.itemClass}>
        {/* eslint-disable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */}
        <div
          role={this.hasLink ? "link" : null}
          tabIndex={this.hasLink ? "0" : null}
          className={tileClass}
          onClick={this.handleTileClick}
        >
          {/* eslint-enable jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-tabindex */}
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
              <h3
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
            {content && (
              <div className={`${baseClass}__content`}>{content}</div>
            )}
            {postAttribution && (
              <div className={`${baseClass}__user`}>{postAttribution}</div>
            )}
            {date && (
              <span className={`${baseClass}__footer`}>
                <FormattedDate format={dateFormat} date={date} />
              </span>
            )}
          </div>
        </div>
        {this.props.destroyCallback && (
          <div
            className="utility-button"
            data-id={"destroy"}
            onClick={this.props.destroyCallback}
            role="button"
            tabIndex="0"
          >
            <Utility.IconComposer
              icon="delete32"
              size={26}
              iconClass={"utility-button__icon utility-button__icon--notice"}
            />
            <span className="screen-reader-text">Delete Event</span>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(EventTile);
