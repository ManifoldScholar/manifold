import React from 'react';
import TextNode from '../TextNode';
import DefaultNode from '../DefaultNode';
import LinkNode from '../LinkNode';
import isEmpty from 'lodash/isEmpty';

export default class NodeTreeIterator {

  constructor(annotations) {
    this.annotations = annotations || [];
    this.annotationsMap = {};
    this.annotationStartMap = {};
    this.annotationEndMap = {};
    this.annotations.forEach((a) => {
      this.annotationsMap[a.id] = a;
      if (this.annotationStartMap.hasOwnProperty(a.attributes.startNode)) {
        this.annotationStartMap[a.attributes.startNode].push(a.id);
      } else {
        this.annotationStartMap[a.attributes.startNode] = [a.id];
      }
      if (this.annotationEndMap.hasOwnProperty(a.attributes.endNode)) {
        this.annotationEndMap[a.attributes.endNode].push(a.id);
      } else {
        this.annotationEndMap[a.attributes.endNode] = [a.id];
      }
    });
    this.openAnnotations = {};
  }

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

  startAnnotations(nodeUuid) {
    const annotationIds = this.annotationStartMap[nodeUuid];
    annotationIds.forEach((annotationId) => {
      const annotation = this.annotationsMap[annotationId];
      this.openAnnotations[annotation.id] = annotation;
    });
  }

  endAnnotations(nodeUuid) {
    const annotationIds = this.annotationEndMap[nodeUuid];
    annotationIds.forEach((annotationId) => {
      const annotation = this.annotationsMap[annotationId];
      delete this.openAnnotations[annotation.id];
    });
  }

  visit(node, parent = null) {

    if (this.annotationStartMap.hasOwnProperty(node.nodeUuid)) {
      this.startAnnotations(node.nodeUuid);
    }

    const openAnnotations = Object.assign({}, this.openAnnotations);
    const adjustedNode = Object.assign({}, node, { openAnnotations });
    let out;

    switch (node.nodeType) {
      case 'element':
        out = this.visitElementNode(adjustedNode);
        break;
      case 'text':
        out = this.visitTextNode(adjustedNode, parent);
        break;
      default:
        out = null;
        break;
    }

    if (this.annotationEndMap.hasOwnProperty(node.nodeUuid)) {
      this.endAnnotations(node.nodeUuid);
    }

    return out;

  }
}
