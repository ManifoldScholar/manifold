import React, { Component, PropTypes } from 'react';
import mapKeys from 'lodash/mapKeys';

export default (RenderComponent) => {

  class ValidatedNode extends Component {

    static propTypes = {
      children: PropTypes.array,
      attributes: PropTypes.object,
      tag: PropTypes.string
    };

    styleStringToObject(stylesString) {
      const declarations = stylesString.split(';');
      const object = declarations.reduce((previous, value) => {
        const parts = value.split(':');
        previous[parts[0]] = parts[1]; // eslint-disable-line no-param-reassign
        return previous;
      }, {});
      return object;
    }

    cleanAttributes(attr) {
      const map = {
        class: 'className',
        for: 'htmlFor',
        colspan: 'colSpan',
      };
      const mapped = mapKeys(attr, (attributeValue, attributeName) => {
        return map.hasOwnProperty(attributeName) ? map[attributeName] : attributeName;
      });
      if (mapped.hasOwnProperty('style')) {
        mapped.style = this.styleStringToObject(mapped.style);
      }
      return mapped;
    }

    render() {
      return (
        <RenderComponent
          children={this.props.children}
          attributes={this.cleanAttributes(this.props.attributes)}
          tag={this.props.tag}
          {...this.state}
        />
      );
    }
  }

  return ValidatedNode;
};
