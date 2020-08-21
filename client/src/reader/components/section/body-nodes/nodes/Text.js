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

  getAnnotation(id) {
    return this.props.openAnnotations[id];
  }

  doScroll(withTimeout = false) {
    const { scrollAnnotation } = this.props;
    const target = scrollAnnotation
      ? document.querySelector(`[data-annotation-ids*="${scrollAnnotation}"]`)
      : this.el;
    const annotation = scrollAnnotation
      ? this.getAnnotation(scrollAnnotation)
      : null;
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

  containsAnnotations() {
    return !isEmpty(this.props.openAnnotations);
  }

  propsToLocalAnnotationsArray(openAnnotations) {
    return values(openAnnotations).map(a => {
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
      const startNode = a.attributes.startNode;
      const endNode = a.attributes.endNode;
      const resourceId = a.attributes.resourceId;
      const resourceCollectionId = a.attributes.resourceCollectionId;
      const authorCreated = a.attributes.authorCreated;
      const abilities = a.attributes.abilities;
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

  annotatedContent() {
    const annotations = this.propsToLocalAnnotationsArray(
      this.props.openAnnotations
    );
    const content = this.props.content;

    // Create an array that includes all the points in the string where we'll split.
    // Because our annotation.ends are inclusive, we need to add 1 to each of them
    // since substring's second argument is exclusive.
    const splits = union(
      [content.length + 1],
      annotations.filter(el => el.start != null).map(a => a.start),
      annotations
        .filter(el => el.end != null)
        .map(a => a.end + 1 || content.length)
    ).sort((a, b) => a - b);

    // Build a map of IDs to the splits
    const map = splits.map(split => {
      return annotations.filter(annotation => {
        const rangeEnd = annotation.end || content.length;
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
      return content.substring(substringStart, substringEnd);
    });

    // console.log(map, 'map');
    // console.log(chunks, 'chunks');
    // console.log(ends, 'ends');
    // console.log(starts, 'starts');

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

      return (
        <span
          key={index} // eslint-disable-line react/no-array-index-key
          className={classes}
          data-removable-highlight-id={removableHighlightId}
          data-text-annotation-ids={textAnnotationIds}
          data-annotation-ids={map[index].map(a => a.id)}
        >
          {chunk}
          {endingResources.length > 0 ? (
            <Notation.Marker annotations={endingResources} />
          ) : null}
        </span>
      );
    });
  }

  content() {
    return this.props.content;
  }

  commentsCount() {
    const annotations = Object.values(this.props.openAnnotations);
    return annotations.reduce(
      (memo, a) => a.attributes.commentsCount + memo,
      0
    );
  }

  render() {
    const containsAnnotations = this.containsAnnotations();
    const content = containsAnnotations
      ? this.annotatedContent()
      : this.content();
    const commentsCount = containsAnnotations ? this.commentsCount() : null;

    const props = {
      "data-text-digest": this.props.textDigest,
      "data-node-uuid": this.props.nodeUuid
    };
    if (commentsCount) {
      props["data-comments"] = commentsCount;
    }

    return (
      <span
        tabIndex="1"
        {...props}
        ref={el => {
          this.el = el;
        }}
      >
        {content}
      </span>
    );
  }
}
