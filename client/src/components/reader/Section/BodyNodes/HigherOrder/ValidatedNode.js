import React, { Component, PropTypes } from 'react';
import mapKeys from 'lodash/mapKeys';
import humps from 'humps';
import startsWith from 'lodash/startsWith';

export default (RenderComponent) => {

  class ValidatedNode extends Component {

    static propTypes = {
      children: PropTypes.array,
      attributes: PropTypes.object,
      tag: PropTypes.string,
      textDigest: PropTypes.string,
      nodeUuid: PropTypes.string,
      openAnnotations: PropTypes.object
    };

    styleStringToObject(stylesString) {
      const declarations = stylesString.split(';');
      const object = declarations.reduce((previous, value) => {
        const parts = value.split(':');
        const styleProp = humps.camelize(parts[0]);
        previous[styleProp] = parts[1]; // eslint-disable-line no-param-reassign
        return previous;
      }, {});
      return object;
    }

    cleanAttributes(attr) {
      const map = {
        class: 'className',
        for: 'htmlFor',
        colspan: 'colSpan',
        rowspan: 'rowSpan'
      };
      const mapped = mapKeys(attr, (attributeValue, attributeName) => {
        if (map.hasOwnProperty(attributeName)) return map[attributeName];
        if (startsWith(attributeName, 'data')) {
          return humps.decamelize(attributeName, { separator: '-' });
        }
        return attributeName;
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
          textDigest={this.props.textDigest}
          nodeUuid={this.props.nodeUuid}
          openAnnotations={this.props.openAnnotations}
          {...this.state}
        />
      );
    }
  }

  return ValidatedNode;
};
