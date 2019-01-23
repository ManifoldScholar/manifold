import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ListItem from "./ListItem/";

export default class TextList extends Component {
  static displayName = "TextList";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    label: PropTypes.string,
    baseClass: PropTypes.string,
    showAuthors: PropTypes.bool,
    showCovers: PropTypes.bool,
    showDates: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool
  };

  static defaultProps = {
    baseClass: "text-list"
  };

  get texts() {
    return this.props.texts;
  }

  get utilityPosition() {
    return this.props.showAuthors || this.props.showDescriptions
      ? "meta"
      : "content";
  }

  render() {
    const baseClass = this.props.baseClass;
    if (!this.texts || this.texts.length === 0) return null;

    return (
      <nav className={classNames(`${baseClass}__category`)}>
        {this.props.label && (
          <h4 className={`${baseClass}__category-heading`}>
            {this.props.label}
          </h4>
        )}
        <ul className={`${baseClass}__list`}>
          {this.texts.map(text => {
            return (
              <li key={text.id} className={`${baseClass}__item`}>
                <ListItem
                  text={text}
                  showAuthors={this.props.showAuthors}
                  showCovers={this.props.showCovers}
                  showDates={this.props.showDates}
                  showDescriptions={this.props.showDescriptions}
                  showSubtitles={this.props.showSubtitles}
                  utilityPosition={this.utilityPosition}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
