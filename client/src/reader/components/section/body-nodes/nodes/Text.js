import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import values from "lodash/values";
import union from "lodash/union";
import Notation from "reader/components/notation";
import smoothScroll from "../../../../../utils/smoothScroll";

export default class TextNode extends Component {
  static propTypes = {
    content: PropTypes.string,
    openAnnotations: PropTypes.object,
    nodeUuid: PropTypes.string,
    textDigest: PropTypes.string,
    scrollToView: PropTypes.bool,
    scrollKey: PropTypes.string,
    scrollAnnotation: PropTypes.string
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
    return this.props.openAnnotations;
  }

  get containsAnnotations() {
    return !isEmpty(this.openAnnotations);
  }

  get annotation() {
    return this.openAnnotations[this.scrollAnnotation];
  }

  get content() {
    return this.props.content;
  }

  get localAnnotationsArray() {
    return values(this.openAnnotations).map(a => {
      const id = a.id;
      const type = a.attributes.format;
      const isCreator =
        a.id === "selection" ? true : a.attributes.currentUserIsCreator;
      const start =
        a.attributes.startNode === this.props.nodeUuid
          ? a.attributes.startChar
          : null;
      const end =
        a.attributes.endNode === this.props.nodeUuid
          ? a.attributes.endChar
          : null;
      const {
        startNode,
        endNode,
        resourceId,
        resourceCollectionId,
        authorCreated,
        abilities
      } = a.attributes;
      return {
        id,
        type,
        isCreator,
        start,
        end,
        startNode,
        endNode,
        resourceId,
        resourceCollectionId,
        authorCreated,
        abilities
      };
    });
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
      const highlighted = map[index].find(a => a.type === "highlight");
      const underlined = map[index].find(a => a.type === "annotation");
      const isCreator = map[index].find(a => a.isCreator);
      const authorCreated = map[index].find(a => a.authorCreated);
      const lockedSelection = map[index].find(a => a.id === "selection");
      const notations = map[index].filter(
        a => a.type === "resource" || a.type === "resource_collection"
      );
      let endingResources = [];
      let startingResources = [];
      if (notations.length > 0) {
        endingResources = notations.filter(
          a => ends[a.id] === index && a.endNode === this.props.nodeUuid
        );
        startingResources = notations.filter(
          a => starts[a.id] === index && a.startNode === this.props.nodeUuid
        );
      }
      const classes = classNames({
        primary: isCreator,
        secondary: !isCreator,
        tertiary: !isCreator && authorCreated,
        "annotation-locked-selected primary": lockedSelection,
        "annotation-underline": underlined,
        "annotation-highlight": highlighted,
        "annotation-resource": notations.length > 0,
        "annotation-resource-start": notations && startingResources.length > 0,
        "annotation-resource-end": notations && endingResources.length > 0
      });

      const textAnnotationIds = map[index]
        .filter(a => a.type === "annotation")
        .map(a => a.id);

      const removableHighlight = map[index].filter(
        a => a.type === "highlight" && (a.isCreator || a.abilities.delete)
      )[0];
      const removableHighlightId = removableHighlight
        ? removableHighlight.id
        : "";
      const interactiveAttributes =
        !!textAnnotationIds.length || removableHighlight
          ? {
              tabIndex: 0,
              role: "button",
              "aria-haspopup": "dialog"
            }
          : {};

      return (
        <span
          key={index} // eslint-disable-line react/no-array-index-key
          className={classes}
          data-removable-highlight-id={removableHighlightId}
          data-text-annotation-ids={textAnnotationIds}
          data-annotation-ids={map[index].map(a => a.id)}
          {...interactiveAttributes}
        >
          {chunk}
          {endingResources.length > 0 ? (
            <Notation.Marker annotations={endingResources} />
          ) : null}
        </span>
      );
    });
  }

  get commentsCount() {
    const annotations = Object.values(this.openAnnotations);
    return annotations.reduce(
      (memo, a) => a.attributes.commentsCount + memo,
      0
    );
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
    return (
      <span
        ref={el => {
          this.el = el;
        }}
        data-text-digest={this.props.textDigest}
        data-node-uuid={this.props.nodeUuid}
        data-comments={this.containsAnnotations ? this.commentsCount : null}
      >
        {this.containsAnnotations ? this.annotatedContent : this.content}
      </span>
    );
  }
}
