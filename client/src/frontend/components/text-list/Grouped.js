import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Text from "frontend/components/text";

export default class TextListGrouped extends Component {
  static displayName = "TextList.Grouped";

  static propTypes = {
    categories: PropTypes.array.isRequired,
    texts: PropTypes.array.isRequired,
    visibility: PropTypes.object,
    blockClass: PropTypes.string
  };

  static defaultProps = {
    blockClass: "text-list"
  };

  textsForCategory = category => {
    const texts = this.props.texts.filter(text => {
      if (category.id === -1) {
        return text.relationships.category === null;
      }
      if (!text.relationships.category) return false;
      return text.relationships.category.id === category.id;
    });
    return texts;
  };

  addGroup = (collection, category) => {
    const texts = this.textsForCategory(category);
    if (texts.length > 0) {
      collection.push({ category, texts });
    }
  };

  buildGroupedCollection = () => {
    const collection = [];
    const uncategorized = { id: -1, attributes: { title: "Uncategorized" } };
    this.props.categories.map(category => {
      return this.addGroup(collection, category);
    });
    this.addGroup(collection, uncategorized);
    return collection;
  };

  render() {
    const textsByCategory = this.buildGroupedCollection();
    if (textsByCategory.length === 0) return null;
    let categoryKey;
    let header;
    const showCategoryLabels = this.props.visibility.showCategoryLabels;
    const blockClass = this.props.blockClass;

    return (
      <React.Fragment>
        {textsByCategory.map(group => {
          if (group.category === null) {
            categoryKey = 0;
            header = null;
          } else {
            categoryKey = group.category.id;
            header = (
              <h4 className={`${blockClass}__category-heading`}>
                {group.category.attributes.title}
              </h4>
            );
          }

          return (
            <nav
              key={categoryKey}
              className={classNames(`${blockClass}__category`, {
                [`${blockClass}__category--grouped`]: showCategoryLabels,
                [`${blockClass}__category--ungrouped`]: !showCategoryLabels
              })}
            >
              {showCategoryLabels && header}
              <ul className={`${blockClass}__list`}>
                {group.texts.map(text => {
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
        })}
      </React.Fragment>
    );
  }
}
