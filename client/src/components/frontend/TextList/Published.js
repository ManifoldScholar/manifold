import React, { Component, PropTypes } from 'react';
import { Text } from 'components/frontend';
import find from 'lodash/find';

export default class TestListPublished extends Component {

  static displayName = "TextList.Published";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    return (
      <div>
        <section>
          <h4 className="sub-section-heading">
            {'Published Version'}
          </h4>
          <ul className="texts-group">
            <li>
              <Text.Thumbnail text={this.props.text} />
            </li>
          </ul>
        </section>
      </div>
    );
  }
}
