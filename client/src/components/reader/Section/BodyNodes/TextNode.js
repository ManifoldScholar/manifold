import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';
import union from 'lodash/union';
import find from 'lodash/find';

export default class TextNode extends Component {

  static propTypes = {
    content: PropTypes.string,
    openAnnotations: PropTypes.object,
    nodeUuid: PropTypes.string,
    textDigest: PropTypes.string
  };

  containsAnnotations() {
    return !isEmpty(this.props.openAnnotations);
  }

  propsToLocalAnnotationsArray(openAnnotations) {
    return values(openAnnotations).map((a) => {
      const id = a.id;
      const type = a.attributes.format;
      const start = a.attributes.startNode === this.props.nodeUuid ? a.attributes.startChar : null;
      const end = a.attributes.endNode === this.props.nodeUuid ? a.attributes.endChar : null;
      const startNode = a.attributes.startNode;
      const endNode = a.attributes.endNode;
      return { id, type, start, end, startNode, endNode };
    });
  }

  annotatedContent() {
    const annotations = this.propsToLocalAnnotationsArray(this.props.openAnnotations);
    const content = this.props.content;

    // Create an array that includes all the points in the string where we'll split.
    // Because our annotation.ends are inclusive, we need to add 1 to each of them
    // since substring's second argument is exclusive.
    const splits = union(
      [content.length + 1],
      annotations.filter(el => el.start != null).map(a => a.start),
      annotations.filter(el => el.end != null).map(a => a.end + 1 || content.length)
    ).sort((a, b) => a - b);

    // Build a map of IDs to the splits
    const map = splits.map((split, index) => {
      return annotations.filter((annotation) => {
        const rangeEnd = annotation.end || content.length;
        const rangeStart = annotation.start || 0;
        return (rangeStart < split && rangeEnd + 1 >= split);
      });
    });

    // split the string into chunks for each difference and intersection between the ranges
    const chunks = splits.map((split, index) => {
      const substringStart = index === 0 ? 0 : splits[index - 1] - 1;
      const substringEnd = (index === splits.length - 1) ? split + 1 : split - 1;
      return content.substring(substringStart, substringEnd);
    });

    // map the chunks to outputs.
    return chunks.map((chunk, index) => {
      const highlighted = map[index].find(a => a.type === "highlight");
      const underlined = map[index].find(a => a.type === "annotation");
      const classes = classNames({
        'annotation-underline primary': underlined,
        'annotation-highlight primary': highlighted
      });
      return (
        <span key={index} className={classes} data-annotation-ids={map[index].map((a) => a.id)}>
          {chunk}
        </span>
      );
    });
  }

  content() {
    return this.props.content;
  }

  render() {
    const content = this.containsAnnotations() ? this.annotatedContent() : this.content();
    return (
      <span
        data-text-digest={this.props.textDigest}
        data-node-uuid={this.props.nodeUuid}
      >
        {content}
      </span>
    );
  }

}
