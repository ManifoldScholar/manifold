import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import connectData from '../../decorators/connectData';
import { fetchOneSection } from '../../actions/shared/collections';
import { mapKeys } from 'lodash/object';
import { trim } from 'lodash/string';
import { camelizeKeys } from 'humps';

function fetchData(getState, dispatch, location, params) {
  return Promise.all([
    fetchOneSection(params.section_id)(dispatch, getState)
  ]);
}

function mapStateToProps(state) {
  return {
    fetchOneSection: state.collections.results.fetchOneSection.entities,
    sections: state.collections.entities.text_sections
  };
}

@connectData(fetchData)
@connect(mapStateToProps)

class Reader extends Component {

  static propTypes = {
    children: PropTypes.object,
    text: PropTypes.object,
    fetchOneSection: PropTypes.string,
    sections: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor() {
    super();
  }

  getSection = () => {
    return this.props.sections[this.props.fetchOneSection];
  };

  reset = () => {
    this.counter = 0;
  }

  visit = (node, parent = null) => {
    switch (node.nodeType) {
      case 'element':
        return this.visitElementNode(node, parent);
      case 'text':
        return this.visitTextNode(node, parent);
      default:
        return null;
    }
  };

  cleanAttributes = (attr) => {
    const map = {
      'class': 'className',
      'for': 'htmlFor',
      'colspan': 'colSpan'
    };
    const mapped = mapKeys(attr, (attributeValue, attributeName) => {
      return map.hasOwnProperty(attributeName) ? map[attributeName] : attributeName;
    });
    if (mapped.hasOwnProperty('style')) {
      mapped.style = this.styleStringToObject(mapped.style);
    }
    return mapped;
  };

  styleStringToObject = (stylesString) => {
    const declarations = stylesString.split(';');
    const object = declarations.reduce((previous, value, index) => {
      const parts = value.split(':');
      previous[parts[0]] = parts[1]
      return previous;
    }, {});
    return camelizeKeys(object);
  };

  traverse = (node) => {
    const children = node.children;
    if (Array.isArray(children)) {
      const childElements = [];
      children.forEach((child, index) => {
        const adjustedChild = Object.assign({}, child);
        adjustedChild.attributes = Object.assign({}, adjustedChild.attributes, {key: index});
        const childNode = this.visit(adjustedChild, node);
        if (childNode ) {
          childElements.push(childNode );
        }
      });
      return childElements;
    }
  };

  visitElementNode = (node, parentIgnored) => {
    const out = React.createElement(node.tag, this.cleanAttributes(node.attributes), this.traverse(node) );
    return out;
  };

  visitTextNode = (node, parent) => {
    const noTextNodes = ['area', 'audio', 'map', 'track', 'video', 'embed', 'object',
      'param', 'source', 'canvas', 'noscript', 'script', 'col', 'colgroup', 'table',
      'tbody', 'tfoot', 'thead', 'tr'];
    if (!parent || parent.nodeType !== 'element' || !noTextNodes.includes(parent.tag)) {
      return node.content;
    }
  };

  buildTextSection = () => {
    const section = this.getSection();
    const node = section.attributes.bodyJson;
    const elements = this.visit(node, null);
    return elements;
  };

  render() {
    this.reset();
    const section = this.getSection();
    return (
        <div>
          <h3 style={{padding: 20, marginTop: 0, backgroundColor: '#DDD'}}>
            {section.attributes.name}
          </h3>
          <div style={{padding: 20}}>
            {this.buildTextSection()}
          </div>
        </div>
    );
  }
}

export default connect(
)(Reader);

