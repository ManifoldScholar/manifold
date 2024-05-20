import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import isEmpty from "lodash/isEmpty";
import values from "lodash/values";
import union from "lodash/union";
import Notation from "reader/components/notation";
import smoothScroll from "utils/smoothScroll";
import { withTranslation } from "react-i18next";

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
        abilities,
        annotationStyle
      } = a.attributes;
      return {
        id,
        type,
        annotationStyle,
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
      const highlighted = map[index].some(a => a.type === "highlight");
      const underlined = map[index].some(a => a.type === "annotation");
      const wavy = map[index].some(a => a.annotationStyle === "wavy");
      const dots = map[index].some(a => a.annotationStyle === "dots");
      const dashes = map[index].some(a => a.annotationStyle === "dashes");
      const solid = map[index].some(a => a.annotationStyle === "solid");
      const pending = map[index].some(a => a.annotationStyle === "pending");
      const previous =
        map[index].length === 1 && map[index].some(a => a.type === "previous"); // don't style as previous if node has multiple annotations
      const isCreator = map[index].some(a => a.isCreator);
      const authorCreated = map[index].some(a => a.authorCreated);
      const lockedSelection = map[index].some(
        a => a.id === "selection" && a.type !== "previous"
      );
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

      const textAnnotationIds = map[index]
        .filter(a => a.type === "annotation")
        .map(a => a.id);

      const removableHighlight = map[index].filter(
        a => a.type === "highlight" && (a.isCreator || a.abilities.delete)
      )[0];

      const removableHighlightId = removableHighlight
        ? removableHighlight.id
        : "";

      const isDetail = this.props.openAnnotations.isDetail;
      const isInteractive =
        !pending &&
        !isDetail &&
        (!!textAnnotationIds.length || removableHighlight);

      const classes = classNames({
        primary: isCreator,
        secondary: !isCreator,
        tertiary: !isCreator && authorCreated,
        inert: isDetail,
        "annotation-locked-selected primary": lockedSelection,
        "annotation-underline": underlined,
        "annotation-highlight": highlighted,
        "annotation-wavy": wavy,
        "annotation-dashes": dashes,
        "annotation-dots": dots,
        "annotation-solid": solid,
        "annotation-resource": notations.length > 0,
        "annotation-resource-start": notations && startingResources.length > 0,
        "annotation-resource-end": notations && endingResources.length > 0,
        pending,
        previous
      });

      const interactiveAttributes =
        isInteractive && !this.props.hasInteractiveAncestor
          ? {
              href: textAnnotationIds.length
                ? `#annotation-${textAnnotationIds[0]}`
                : undefined,
              tabIndex: removableHighlight ? 0 : undefined,
              role: removableHighlight ? "button" : undefined,
              "aria-haspopup": removableHighlight ? "menu" : "dialog",
              "aria-label": removableHighlight
                ? this.ariaLabelForHighlight(chunk)
                : this.ariaLabelForAnnotation(chunk)
            }
          : {};

      const previousTabIndex = previous ? { tabIndex: -1 } : {};

      const props = {
        key: index,
        className: classes,
        "data-removable-highlight-id": removableHighlightId,
        "data-text-annotation-ids": textAnnotationIds,
        "data-annotation-ids": map[index].map(a => a.id),
        ...interactiveAttributes,
        ...previousTabIndex
      };

      const Tag = interactiveAttributes.href ? "a" : "span";

      return (
        <Tag {...props}>
          {chunk}
          {endingResources.length > 0 ? (
            <Notation.Marker annotations={endingResources} />
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

  ariaLabelForHighlight(chunk) {
    return this.props.t("reader.actions.manage_highlight", { chunk });
  }

  ariaLabelForAnnotation(chunk) {
    return this.props.t("reader.actions.view_annotations", { chunk });
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
