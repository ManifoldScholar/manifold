import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Date from "./Date";
import { Link } from "react-router-dom";

export default class TextListListItemBibliographic extends Component {
  static displayName = "TextList.ListItem.Bibliographic";

  static propTypes = {
    baseClass: PropTypes.string,
    creatorNames: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    subtitle: PropTypes.string,
    date: PropTypes.string,
    datePrefix: PropTypes.string,
    publishedVisible: PropTypes.bool,
    readUrl: PropTypes.string.isRequired
  };

  get showStatus() {
    return this.props.date || this.props.publishedVisible;
  }

  get readUrl() {
    return this.props.readUrl;
  }

  render() {
    const baseClass = this.props.baseClass;

    return (
      <div className={`${baseClass}__bibliographic`}>
        <Link to={this.readUrl}>
          <h3 className={`${baseClass}__name`}>
            <span
              className={`${baseClass}__title`}
              dangerouslySetInnerHTML={{
                __html: this.props.title
              }}
            />
            {this.props.subtitle && (
              <span className={`${baseClass}__subtitle`}>
                {this.props.subtitle}
              </span>
            )}
          </h3>
        </Link>
        {this.props.creatorNames && (
          <div className={`${baseClass}__creators`}>
            <span style={{ fontStyle: "italic" }}>by </span>
            {this.props.creatorNames}
          </div>
        )}
        {this.props.description && (
          <div
            className={`${baseClass}__description markdown`}
            dangerouslySetInnerHTML={{ __html: this.props.description }}
          />
        )}
        {this.showStatus && (
          <div
            className={classNames(
              `${baseClass}__status`,
              `${baseClass}__status--block`
            )}
          >
            {this.props.date && (
              <Date
                date={this.props.date}
                datePrefix={this.props.datePrefix}
                baseClass={baseClass}
              />
            )}
            {this.props.publishedVisible && (
              <span className={`${baseClass}__published`}>Published</span>
            )}
          </div>
        )}
      </div>
    );
  }
}
