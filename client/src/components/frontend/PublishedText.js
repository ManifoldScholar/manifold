import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { TextThumb } from './';

export default class PublishedText extends Component {

  static propTypes = {
    texts: PropTypes.array
  };

  render = () => {
    // Reduce texts to single, published text (there should be only one)
    const publishedTexts = this.props.texts.filter((text) =>{
      return text.attributes.published === true;
    });

    const publishedText = publishedTexts[0];

    return (
        <div>
          <section>
            <h4 className="sub-section-heading">
              {'Published Version'}
            </h4>
            <ul className="texts-group">
              <li>
                <TextThumb text={publishedText} />
              </li>
            </ul>
          </section>
        </div>
    );
  };
}
