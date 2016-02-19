import React from 'react';
import { DefaultNode, LinkNode, TextNode } from '../';

class NodeTreeIterator {

  visitChildren(node) {
    const children = node.children;
    if (Array.isArray(children)) {
      const childElements = [];
      children.forEach((child, index) => {
        const adjustedChild = Object.assign({}, child);
        adjustedChild.attributes = Object.assign({}, adjustedChild.attributes);
        adjustedChild.key = index;
        const childNode = this.visit(adjustedChild, node);
        if (childNode) {
          childElements.push(childNode);
        }
      });
      return childElements;
    }
  }

  visitElementNode(node) {
    let ComponentClass;
    switch (node.tag) {
      case 'a':
        ComponentClass = LinkNode;
        break;
      default:
        ComponentClass = DefaultNode;
        break;
    }
    return React.createElement(ComponentClass, node, this.visitChildren(node));
  }

  visitTextNode(node, parent) {
    const noTextNodes = ['area', 'audio', 'map', 'track', 'video', 'embed', 'object',
      'param', 'source', 'canvas', 'noscript', 'script', 'col', 'colgroup', 'table',
      'tbody', 'tfoot', 'thead', 'tr'];
    if (!parent || parent.nodeType !== 'element' || !noTextNodes.includes(parent.tag)) {
      return React.createElement(TextNode, node);
    }
  }

  visit(node, parent = null) {
    switch (node.nodeType) {
      case 'element':
        return this.visitElementNode(node);
      case 'text':
        return this.visitTextNode(node, parent);
      default:
        return null;
    }
  }
}

export default new NodeTreeIterator;
