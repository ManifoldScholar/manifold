import React, { Component } from "react";
import PropTypes from "prop-types";
import Date from "./Date";
import Counts from "./Counts";

export default class TextListListItemMeta extends Component {
  static displayName = "TextList.ListItem.Meta";

  static propTypes = {
    text: PropTypes.object.isRequired,
    baseClass: PropTypes.string,
    datesVisible: PropTypes.bool,
    publishedVisible: PropTypes.bool
  };

  render() {
    const text = this.props.text;
    const baseClass = this.props.baseClass;

    return (
      <div className={`${baseClass}__meta`}>
        {this.props.datesVisible && (
          <Date
            baseClass={baseClass}
            date={this.props.text.attributes.createdAt}
            inline
          />
        )}
        {this.props.publishedVisible && (
          <span className={`${this.props.baseClass}__status`}>Published</span>
        )}
        <Counts text={text} baseClass={baseClass} />
      </div>
    );
  }
}
