import React, { Component, PropTypes } from 'react';
import { TextThumb } from './';

export default class GroupedTexts extends Component {

  static propTypes = {
    categories: PropTypes.array,
    texts: PropTypes.array
  };

  render = () => {
    // Build an array of texts by category that can
    // be easily iterated inside the view
    const textsByCategory = [];

    this.props.categories.map((category) => {
      const categorizedTexts = this.props.texts.filter((text) => {
        if (Object.keys(text.relationships.category).length > 0) {
          return text.relationships.category.id === category.id;
        }
      });

      if (categorizedTexts.length > 0) {
        textsByCategory.push({
          title: category.title,
          texts: categorizedTexts
        });
      }
    });

    return (
        <div>
            {textsByCategory.map((category) => {
              return (
                  <section>
                    <h4 className="sub-section-heading">
                      {category.title}
                    </h4>
                    <ul className="texts-group">
                      {category.texts.map((text)=>{
                        return (
                          <li>
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
  };
}
