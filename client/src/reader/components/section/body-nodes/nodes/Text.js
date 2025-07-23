import React, { Component } from "react";
import PropTypes from "prop-types";
import isEmpty from "lodash/isEmpty";
import values from "lodash/values";
import union from "lodash/union";
import ResourceAnnotationFactory from "reader/components/resource-annotation";
import smoothScroll from "utils/smoothScroll";
import { withTranslation } from "react-i18next";
import {
  getAnnotationProps,
  formatLocalAnnotations
} from "../helpers/annotation";

class TextNode extends Component {
  static propTypes = {
    content: PropTypes.string,
    openAnnotations: PropTypes.object,
    nodeUuid: PropTypes.string,
    textDigest: PropTypes.string,
    scrollToView: PropTypes.bool,
    scrollKey: PropTypes.string,
    scrollAnnotation: PropTypes.string,
    t: PropTypes.func,
    hasInteractiveAncestor: PropTypes.bool
  };

  componentDidMount() {
    if (this.props.scrollToView && this.props.scrollKey) {
      this.doScroll(true);
    }
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.scrollToView &&
      this.props.scrollKey !== prevProps.scrollKey
    ) {
      this.doScroll(false);
    }
  }

  get scrollAnnotation() {
    return this.props.scrollAnnotation;
  }

  get openAnnotations() {
    const { isDetail, ...annotations } = this.props.openAnnotations;
    return annotations;
  }

  get containsAnnotations() {
    return !isEmpty(this.openAnnotations);
  }

  get annotation() {
    return this.openAnnotations[this.scrollAnnotation];
  }

  get content() {
    return this.props.content ?? "";
  }

  get localAnnotationsArray() {
    return formatLocalAnnotations(
      values(this.openAnnotations),
      this.props.nodeUuid
    );
  }

  get annotatedContent() {
    // Create an array that includes all the points in the string where we'll split.
    // Because our annotation.ends are inclusive, we need to add 1 to each of them
    // since substring's second argument is exclusive.
    const splits = union(
      [this.content.length + 1],
      this.localAnnotationsArray
        .filter(el => el.start != null)
        .map(a => a.start),
      this.localAnnotationsArray
        .filter(el => el.end != null)
        .map(a => a.end + 1 || this.content.length)
    ).sort((a, b) => a - b);

    // Build a map of IDs to the splits
    const map = splits.map(split => {
      return this.localAnnotationsArray.filter(annotation => {
        const rangeEnd = annotation.end || this.content.length;
        const rangeStart = annotation.start || 0;
        return rangeStart < split && rangeEnd + 1 >= split;
      });
    });

    // ends
    const ends = {};
    map.forEach((chunk, index) => {
      chunk.forEach(annotation => {
        ends[annotation.id] = index;
      });
    });

    // starts
    const starts = {};
    map
      .slice()
      .reverse()
      .forEach((chunk, index) => {
        chunk.forEach(annotation => {
          starts[annotation.id] = index;
        });
      });

    // split the string into chunks for each difference and intersection between the ranges
    const chunks = splits.map((split, index) => {
      const substringStart = index === 0 ? 0 : splits[index - 1] - 1;
      const substringEnd = index === splits.length - 1 ? split + 1 : split - 1;
      return this.content.substring(substringStart, substringEnd);
    });

    // map the chunks to outputs.
    return chunks.map((chunk, index) => {
      const {
        classes,
        removableHighlightId,
        textAnnotationIds,
        annotationIds,
        interactiveAttributes,
        interactiveTag
      } = getAnnotationProps({
        annotations: map[index],
        isDetail: this.props.openAnnotations.isDetail,
        hasInteractiveAncestor: this.props.hasInteractiveAncestor,
        nodeUuid: this.props.nodeUuid,
        chunk,
        t: this.props.t
      });

      const Tag = interactiveTag ?? "span";

      const props = {
        className: classes,
        "data-removable-highlight-id": removableHighlightId,
        "data-text-annotation-ids": textAnnotationIds,
        "data-annotation-ids": annotationIds,
        ...interactiveAttributes
      };

      const endingResources = map[index].filter(
        a =>
          ends[a.id] === index &&
          a.endNode === this.props.nodeUuid &&
          (a.type === "resource" || a.type === "resource_collection")
      );

      return (
        // eslint-disable-next-line react/no-array-index-key
        <Tag key={index} {...props}>
          {chunk}
          {endingResources.length > 0 ? (
            <ResourceAnnotationFactory annotations={endingResources} />
          ) : null}
        </Tag>
      );
    });
  }

  get commentsCount() {
    const annotations = Object.values(this.openAnnotations);
    const count = annotations.reduce(
      (memo, a) => a.attributes.commentsCount + memo,
      0
    );
    return Number.isInteger(count) ? count : null;
  }

  doScroll(withTimeout = false) {
    const target = this.scrollAnnotation
      ? document.querySelector(
          `[data-annotation-ids*="${this.scrollAnnotation}"]`
        )
      : this.el;
    const annotation = this.scrollAnnotation ? this.annotation : null;
    const doClick = annotation && annotation.attributes.format === "annotation";
    const scroll = () => {
      smoothScroll(target, 100, 500, () => {
        if (doClick) target.click();
      });
    };
    if (withTimeout) {
      setTimeout(scroll, 0);
    } else {
      scroll();
    }
  }

  render() {
    const content = this.containsAnnotations
      ? this.annotatedContent
      : this.content;
    return (
      <span
        ref={el => {
          this.el = el;
        }}
        data-text-digest={this.props.textDigest}
        data-node-uuid={this.props.nodeUuid}
        data-comments={this.containsAnnotations ? this.commentsCount : null}
      >
        {content}
      </span>
    );
  }
}

export default withTranslation()(TextNode);
