import React, { Component, PropTypes } from 'react';
import { Text } from 'components/frontend';

export default class TextListGrouped extends Component {

  static displayName = "TextList.Grouped";

  static propTypes = {
    categories: PropTypes.array,
    texts: PropTypes.array,
    excludeIds: PropTypes.array
  };

  constructor() {
    super();
    this.textsForCategory = this.textsForCategory.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.buildGroupedCollection = this.buildGroupedCollection.bind(this);
  }

  textsForCategory(category) {
    const texts = this.props.texts.filter((text) => {
      if (this.props.excludeIds && this.props.excludeIds.indexOf(text.id) !== -1) {
        return false;
      }
      if (category.id === -1) {
        return text.relationships.category === null;
      }
      if (!text.relationships.category) return false;
      return text.relationships.category.id === category.id;
    });
    return texts;
  }

  addGroup(collection, category) {
    const texts = this.textsForCategory(category);
    if (texts.length > 0) {
      collection.push({ category, texts });
    }
  }

  buildGroupedCollection() {
    const collection = [];
    const uncategorized = { id: -1, attributes: { title: "Uncategorized" } };
    this.addGroup(collection, uncategorized);
    this.props.categories.map((category) => {
      this.addGroup(collection, category);
    });
    return collection;
  }

  render() {
    const textsByCategory = this.buildGroupedCollection();
    let categoryKey;
    let header;

    return (
      <div>
        {textsByCategory.map((group) => {

          if (group.category === null) {
            categoryKey = 0;
            header = null;
          } else {
            categoryKey = group.category.id;
            header = (
              <h4 className="sub-section-heading">
                {group.category.attributes.title}
              </h4>
            );
          }

          return (
            <nav key={categoryKey} className="text-category">
              {header}
              <ul className="texts-group">
                {group.texts.map((text) => {
                  return (
                    <li key={text.id}>
                      <Text.Thumbnail text={text}/>
                    </li>
                  );
                })}
              </ul>
            </nav>
          );
        })}
      </div>
    );
  }
}
