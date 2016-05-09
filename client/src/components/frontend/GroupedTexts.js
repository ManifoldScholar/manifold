import React, { Component, PropTypes } from 'react';
import { TextThumb } from './';

export default class GroupedTexts extends Component {

  static propTypes = {
    categories: PropTypes.array,
    texts: PropTypes.array
  };

  constructor() {
    super();
    this.textsForCategory = this.textsForCategory.bind(this);
    this.addGroup = this.addGroup.bind(this);
    this.buildGroupedCollection = this.buildGroupedCollection.bind(this);
  }

  textsForCategory(category) {
    return this.props.texts.filter((text) => {
      if (category === null) {
        return text.relationships.category === null;
      }
      if (!text.relationships.category) return false;
      return text.relationships.category.id === category.id;
    });
  }

  addGroup(collection, category) {
    const texts = this.textsForCategory(category);
    if (texts.length > 0) {
      collection.push({ category, texts });
    }
  }

  buildGroupedCollection() {
    const collection = [];
    this.addGroup(collection, null);
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
            <section key={categoryKey}>
              {header}
              <ul className="texts-group">
                {group.texts.map((text) => {
                  return (
                    <li key={text.id}>
                      <TextThumb text={text}/>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    );
  }
}
