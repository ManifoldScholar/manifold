import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { hash } from "utils/string";

export default class AnnotationGroupedBySubject extends PureComponent {
  static displayName = "Annotation.GroupBy.Subject";

  static propTypes = {
    annotations: PropTypes.array.isRequired,
    render: PropTypes.func.isRequired
  };

  static defaultProps = {
    annotations: []
  };

  /* eslint-disable no-param-reassign */
  get grouped() {
    const grouped = this.props.annotations.reduce((memo, annotation) => {
      const key = hash(annotation.attributes.subject.trim());
      if (!memo.hasOwnProperty(key)) {
        memo[key] = {
          annotations: [],
          annotation,
          selection: {
            hash: key,
            subject: annotation.attributes.subject,
            startNode: annotation.attributes.startNode,
            startChar: annotation.attributes.startChar,
            endNode: annotation.attributes.endNode,
            endChar: annotation.attributes.endChar
          }
        };
      }
      memo[key].annotations.push(annotation);
      return memo;
    }, {});
    return Object.values(grouped);
  }
  /* eslint-enable no-param-reassign */

  render() {
    return <>{this.grouped.map(group => this.props.render(group))}</>;
  }
}
