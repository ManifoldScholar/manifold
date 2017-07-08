import React, { PureComponent, createElement } from "react";
import PropTypes from "prop-types";

export default class SimpleFormat extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    wrapperTag: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    postfix: PropTypes.string,
    wrapperTagProps: PropTypes.object
  };

  static defaultProps = {
    wrapperTag: "div",
    wrapperTagProps: {}
  };

  lines(text) {
    const lines = text.match(/[^\r\n]+/g);
    return lines;
  }

  render() {
    /* eslint-disable no-unused-vars */
    const { text, wrapperTag, wrapperTagProps, postfix } = this.props;
    /* eslint-enable no-unused-vars */
    const lines = this.lines(text);
    const children = (
      <p>
        {lines.map((line, index) => {
          const last = index === lines.length - 1;
          const after = last ? null : <br />;
          return (
            <span key={line}>
              {line}
              {after}
            </span>
          );
        })}
      </p>
    );
    return createElement(wrapperTag, wrapperTagProps, children);
  }
}
