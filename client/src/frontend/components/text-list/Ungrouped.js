import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Text from "frontend/components/text";

export default class TestListUngrouped extends Component {
  static displayName = "TextListUngrouped";

  static propTypes = {
    texts: PropTypes.array.isRequired,
    visibility: PropTypes.object,
    blockClass: PropTypes.string
  };

  static defaultProps = {
    blockClass: "text-list"
  };

  render() {
    const blockClass = this.props.blockClass;

    return (
      <nav
        className={classNames(
          `${blockClass}__category`,
          `${blockClass}__category--ungrouped`
        )}
      >
        <ul className={`${blockClass}__list`}>
          {this.props.texts.map(text => {
            return (
              <li key={text.id} className={`${blockClass}__item`}>
                <Text.Thumbnail
                  text={text}
                  visibility={this.props.visibility}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}
