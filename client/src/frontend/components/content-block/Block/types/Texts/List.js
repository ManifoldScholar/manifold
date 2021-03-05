import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import ListItem from "./ListItem";

export default class ContentBlockTextsBlockList extends Component {
  static displayName = "ContentBlock.Types.Texts.List";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    label: PropTypes.string,
    baseClass: PropTypes.string,
    showAuthors: PropTypes.bool,
    showCovers: PropTypes.bool,
    showDates: PropTypes.bool,
    showDescriptions: PropTypes.bool,
    showSubtitles: PropTypes.bool,
    showCollectingToggle: PropTypes.bool
  };

  static defaultProps = {
    baseClass: "text-list",
    showCollectingToggle: true
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
      <div className={classNames(`${baseClass}__category`)}>
        {this.props.label && (
          <h3 className={`${baseClass}__category-heading`}>
            {this.props.label}
          </h3>
        )}
        <ul
          className={classNames(`${baseClass}__list`, {
            [`${baseClass}__list--no-label`]: !this.props.label
          })}
        >
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
                  showCollectingToggle={this.props.showCollectingToggle}
                  utilityPosition={this.utilityPosition}
                />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
