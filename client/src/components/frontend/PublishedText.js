import React, { Component, PropTypes } from 'react';
import { TextThumb } from './';
import find from 'lodash/find';

export default class PublishedText extends Component {

  static propTypes = {
    texts: PropTypes.array
  };

  constructor() {
    super();
    this.findPublishedText = this.findPublishedText.bind(this);
  }

  findPublishedText() {
    return find(this.props.texts, (text) => {
      return text.attributes.published === true;
    });
  }

  render() {
    const publishedText = this.findPublishedText();
    if (!publishedText) return null;

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
  }
}
