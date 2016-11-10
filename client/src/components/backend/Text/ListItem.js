import React, { Component, PropTypes } from 'react';
import { Text } from 'components/global';
import { Link } from 'react-router';

export default class ListItem extends Component {

  static displayName = "Text.ListItem";

  static propTypes = {
    text: PropTypes.object
  };

  render() {
    const attr = this.props.text.attributes;

    return (
      <div>
        <a className="asset-thumb" href="#">
          <figure className="asset-image">
            <Text.Placeholder/>
          </figure>

          <div className="asset-description">
            <h3 className="asset-title">
              {attr.title}
              <span className="subtitle">
                {attr.subtitle}
              </span>
            </h3>
            <datetime className="asset-date">
              {`Added ${attr.createdAt}`}
            </datetime>
              <span className="asset-state">
                Hidden
              </span>
          </div>
        </a>

        <div className="text-category-list-utility">
          <button>{'Edit'}</button>
          <button><i className="manicon manicon-arrow-up"></i></button>
          <button><i className="manicon manicon-arrow-down"></i></button>
          <button><i className="manicon manicon-x"></i></button>
        </div>
      </div>
    );
  }

}
