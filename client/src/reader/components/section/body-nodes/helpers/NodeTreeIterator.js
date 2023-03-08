import React from "react";
import Nodes from "../nodes";
import has from "lodash/has";
import upperFirst from "lodash/upperFirst";
import { mathNodeHelpers } from "../nodes/Math";
import { ErrorBoundary } from "react-error-boundary";
import * as Styled from "./styles";

const MathError = () => <Styled.Error>MathML error</Styled.Error>;

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
    const { annotations, pendingAnnotation, isDetail } = bodyProps;
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
    this.openAnnotations = { isDetail };
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

  visitChildren(node, blacklist) {
    const children = node.children;
    if (Array.isArray(children)) {
      const childElements = [];
      children.forEach((child, index) => {
        const adjustedChild = { ...child };
        adjustedChild.attributes = { ...adjustedChild.attributes };
        adjustedChild.key = index;
        const childNode = this.visit(adjustedChild, node, blacklist);
        if (childNode) {
          childElements.push(childNode);
        }
      });
      return childElements;
    }
  }

  visitElementNode(node, mathUuids, blacklist) {
    if (blacklist && blacklist[node.tag]) return <p>{blacklist[node.tag]}</p>;
    let ComponentClass = Nodes.Default;
    const lookup = upperFirst(node.tag);
    if (Nodes.hasOwnProperty(lookup)) ComponentClass = Nodes[lookup];
    if (lookup === "A") ComponentClass = Nodes.Link;
    if (lookup === "Math") {
      return (
        <ErrorBoundary key={node.key} FallbackComponent={MathError}>
          {React.createElement(
            ComponentClass,
            { ...node, uuids: mathUuids },
            node.children
          )}
        </ErrorBoundary>
      );
    }
    return React.createElement(
      ComponentClass,
      node,
      this.visitChildren(node, blacklist)
    );
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
      "Table",
      "tbody",
      "tfoot",
      "thead",
      "tr",
      "math"
    ];
    if (
      !parent ||
      parent.nodeType !== "element" ||
      !noTextNodes.includes(parent.tag)
    ) {
      return React.createElement(Nodes.Text, node);
    }
  }

  startAnnotations(nodeUuid) {
    const annotationIds = this.annotationStartMap[nodeUuid];
    if (annotationIds) {
      annotationIds.forEach(annotationId => {
        const annotation = this.annotationsMap[annotationId];
        this.openAnnotations[annotation.id] = annotation;
      });
    }
  }

  endAnnotations(nodeUuid) {
    const annotationIds = this.annotationEndMap[nodeUuid];
    if (annotationIds) {
      annotationIds.forEach(annotationId => {
        const annotation = this.annotationsMap[annotationId];
        delete this.openAnnotations[annotation.id];
      });
    }
  }

  visit(node, parent = null, blacklist) {
    let mathUuids;
    if (node.tag === "math") {
      mathUuids = mathNodeHelpers.getUuids(node.children);
      mathUuids.map(uuid => this.startAnnotations(uuid));
    } else if (this.annotationStartMap.hasOwnProperty(node.nodeUuid)) {
      this.startAnnotations(node.nodeUuid);
    }

    const openAnnotations = { ...this.openAnnotations };
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

    const adjustedNode = {
      ...node,
      openAnnotations,
      scrollAnnotation,
      scrollNode,
      scrollToView,
      scrollKey
    };
    let out;

    switch (node.nodeType) {
      case "element":
        out = this.visitElementNode(adjustedNode, mathUuids, blacklist);
        break;
      case "text":
        out = this.visitTextNode(adjustedNode, parent);
        break;
      default:
        out = null;
        break;
    }

    if (mathUuids) {
      mathUuids.map(uuid => this.endAnnotations(uuid));
    } else if (this.annotationEndMap.hasOwnProperty(node.nodeUuid)) {
      this.endAnnotations(node.nodeUuid);
    }

    return out;
  }
}
