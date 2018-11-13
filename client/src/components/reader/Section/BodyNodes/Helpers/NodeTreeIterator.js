import React from "react";
import TextNode from "../TextNode";
import DefaultNode from "../DefaultNode";
import LinkNode from "../LinkNode";
import has from "lodash/has";

export default class NodeTreeIterator {
  constructor(bodyProps) {
    this.setupAnnotations(bodyProps);
    this.setScrollTargetNode(bodyProps);
  }

  makePendingAnnotation(pendingAnnotation) {
    const annotation = {
      id: "selection",
      attributes: pendingAnnotation,
      type: "annotations"
    };
    return annotation;
  }

  setupAnnotations(bodyProps) {
    const { annotations, pendingAnnotation } = bodyProps;
    this.annotations = annotations ? annotations.slice(0) : [];
    if (pendingAnnotation)
      this.annotations.push(this.makePendingAnnotation(pendingAnnotation));
    this.annotationsMap = {};
    this.annotationStartMap = {};
    this.annotationEndMap = {};
    this.annotations.forEach(a => {
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

  setScrollTargetNode(bodyProps) {
    const hash = bodyProps.location.hash;
    if (!hash) return;
    const annotationUuid = new RegExp(
      /^#(annotation)-([a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12})/
    );
    const nodeHexDigest = new RegExp(/^#(node)-([a-f0-9]{40})/);
    const match = hash.match(annotationUuid) || hash.match(nodeHexDigest);
    const identifier = match ? match[1] : hash;
    const id = match ? match[2] : null;
    this.scrollKey = bodyProps.location.key || "INIT";
    if (identifier === "node") {
      this.nodeScrollTarget = id;
    } else if (identifier === "annotation") {
      this.annotationScrollTarget = id;
    } else {
      this.elementScrollTarget = identifier.substring(1);
    }
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
      case "a":
        ComponentClass = LinkNode;
        break;
      default:
        ComponentClass = DefaultNode;
        break;
    }
    return React.createElement(ComponentClass, node, this.visitChildren(node));
  }

  visitTextNode(node, parent) {
    const noTextNodes = [
      "area",
      "audio",
      "map",
      "track",
      "video",
      "embed",
      "object",
      "param",
      "source",
      "canvas",
      "noscript",
      "script",
      "col",
      "colgroup",
      "table",
      "tbody",
      "tfoot",
      "thead",
      "tr"
    ];
    if (
      !parent ||
      parent.nodeType !== "element" ||
      !noTextNodes.includes(parent.tag)
    ) {
      return React.createElement(TextNode, node);
    }
  }

  startAnnotations(nodeUuid) {
    const annotationIds = this.annotationStartMap[nodeUuid];
    annotationIds.forEach(annotationId => {
      const annotation = this.annotationsMap[annotationId];
      this.openAnnotations[annotation.id] = annotation;
    });
  }

  endAnnotations(nodeUuid) {
    const annotationIds = this.annotationEndMap[nodeUuid];
    annotationIds.forEach(annotationId => {
      const annotation = this.annotationsMap[annotationId];
      delete this.openAnnotations[annotation.id];
    });
  }

  visit(node, parent = null) {
    if (this.annotationStartMap.hasOwnProperty(node.nodeUuid)) {
      this.startAnnotations(node.nodeUuid);
    }

    const openAnnotations = Object.assign({}, this.openAnnotations);
    const scrollElement = !!(
      this.elementScrollTarget &&
      node.nodeType === "element" &&
      node.attributes &&
      node.attributes.id &&
      node.attributes.id === this.elementScrollTarget
    );
    const scrollAnnotation =
      node.nodeType === "text" &&
      has(openAnnotations, this.annotationScrollTarget)
        ? this.annotationScrollTarget
        : null;
    const scrollNode =
      node.nodeType === "text" && this.nodeScrollTarget === node.nodeUuid;
    const scrollToView = !!(scrollAnnotation || scrollNode || scrollElement);
    const scrollKey = scrollToView ? this.scrollKey : null;
    const adjustedNode = Object.assign({}, node, {
      openAnnotations,
      scrollAnnotation,
      scrollNode,
      scrollToView,
      scrollKey
    });
    let out;

    switch (node.nodeType) {
      case "element":
        out = this.visitElementNode(adjustedNode);
        break;
      case "text":
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
