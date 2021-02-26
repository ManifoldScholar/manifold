import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Date from "./Date";
import Counts from "./Counts";

export default class TextListListItemMeta extends Component {
  static displayName = "TextList.ListItem.Meta";

  static propTypes = {
    text: PropTypes.object.isRequired,
    baseClass: PropTypes.string,
    datesVisible: PropTypes.bool,
    datePrefix: PropTypes.string,
    publishedVisible: PropTypes.bool
  };

  get showStatus() {
    return this.props.datesVisible || this.props.publishedVisible;
  }

  render() {
    const text = this.props.text;
    const baseClass = this.props.baseClass;

    return (
      <div className={`${baseClass}__meta`}>
        {this.showStatus && (
          <div
            className={classNames(
              `${baseClass}__status`,
              `${baseClass}__status--inline`
            )}
          >
            {this.props.datesVisible && (
              <Date
                baseClass={baseClass}
                date={this.props.text.attributes.createdAt}
                datePrefix={this.props.datePrefix}
                inline
              />
            )}
            {this.props.publishedVisible && (
              <span className={`${this.props.baseClass}__published`}>
                Published
              </span>
            )}
          </div>
        )}
        <Counts text={text} baseClass={baseClass} />
      </div>
    );
  }
}
