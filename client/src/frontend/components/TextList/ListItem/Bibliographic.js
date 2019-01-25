import React, { Component } from "react";
import PropTypes from "prop-types";
import Date from "./Date";

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
    publishedVisible: PropTypes.bool
  };

  render() {
    return (
      <React.Fragment>
        <h3 className={`${this.props.baseClass}__name`}>
          <span
            className={`${this.props.baseClass}__title`}
            dangerouslySetInnerHTML={{
              __html: this.props.title
            }}
          />
          {this.props.subtitle && (
            <span className={`${this.props.baseClass}__subtitle`}>
              {this.subtitle}
            </span>
          )}
        </h3>
        {this.props.creatorNames && (
          <div className={`${this.props.baseClass}__creators`}>
            <span style={{ fontStyle: "italic" }}>by </span>
            {this.props.creatorNames}
          </div>
        )}
        {this.props.description && (
          <p className={`${this.props.baseClass}__description`}>
            {this.props.description}
          </p>
        )}
        {this.props.date && (
          <Date
            date={this.props.date}
            datePrefix={this.props.datePrefix}
            baseClass={this.props.baseClass}
          />
        )}
        {this.props.publishedVisible && (
          <span className={`${this.props.baseClass}__status`}>Published</span>
        )}
      </React.Fragment>
    );
  }
}
