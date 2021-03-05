import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Date from "./Date";
import { Link } from "react-router-dom";
import Collecting from "frontend/components/collecting";

export default class TextListListItemBibliographic extends Component {
  static displayName = "TextList.ListItem.Bibliographic";

  static propTypes = {
    baseClass: PropTypes.string,
    text: PropTypes.object.isRequired,
    datePrefix: PropTypes.string,
    publishedVisible: PropTypes.bool,
    readUrl: PropTypes.string.isRequired
  };

  get text() {
    return this.props.text;
  }

  get attributes() {
    return this.text.attributes;
  }

  get title() {
    return this.attributes.titleFormatted;
  }

  get subtitle() {
    if (!this.props.showSubtitles) return null;
    return this.attributes.subtitle;
  }

  get description() {
    if (!this.props.showDescriptions) return null;
    return this.attributes.descriptionFormatted;
  }

  get creatorNames() {
    if (!this.props.showAuthors) return null;
    const creatorNames = this.attributes.creatorNames;
    if (Array.isArray(creatorNames)) {
      return creatorNames.map(n => `${n.firstName} ${n.lastName}`).join(", ");
    }
    return creatorNames;
  }

  get date() {
    if (!this.props.datesVisible) return null;
    return this.attributes.updatedAt;
  }

  get showStatus() {
    return this.props.date || this.props.publishedVisible;
  }

  get readUrl() {
    return this.props.readUrl;
  }

  get baseClass() {
    return this.props.baseClass;
  }

  render() {
    return (
      <div className={`${this.baseClass}__bibliographic`}>
        <h4 className={`${this.baseClass}__name`}>
          <Link to={this.readUrl} className={`${this.baseClass}__title-link`}>
            <span className={`${this.baseClass}__title`}>{this.title}</span>
            {this.subtitle && (
              <span className={`${this.baseClass}__subtitle`}>
                {this.subtitle}
              </span>
            )}
          </Link>
          <span
            className={classNames({
              [`${this.baseClass}__collect-toggle`]: true,
              [`${this.baseClass}__collect-toggle--with-subtitle`]: !!this
                .subtitle
            })}
          >
            <Collecting.Toggle collectable={this.text} />
          </span>
        </h4>
        {this.creatorNames && (
          <div className={`${this.baseClass}__creators`}>
            <span style={{ fontStyle: "italic" }}>by </span>
            {this.creatorNames}
          </div>
        )}
        {this.description && (
          <div
            className={`${this.baseClass}__description markdown`}
            dangerouslySetInnerHTML={{ __html: this.props.description }}
          />
        )}
        {this.showStatus && (
          <div
            className={classNames(
              `${this.baseClass}__status`,
              `${this.baseClass}__status--block`
            )}
          >
            {this.props.date && (
              <Date
                date={this.date}
                datePrefix={this.datePrefix}
                baseClass={this.baseClass}
              />
            )}
            {this.publishedVisible && (
              <span className={`${this.baseClass}__published`}>Published</span>
            )}
          </div>
        )}
      </div>
    );
  }
}
