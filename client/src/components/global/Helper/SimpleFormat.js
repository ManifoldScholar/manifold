import React, { PureComponent, PropTypes, createElement } from 'react';

export default class SimpleFormat extends PureComponent {

  static propTypes = {
    text: PropTypes.string.isRequired,
    wrapperTag: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]),
    wrapperTagProps: PropTypes.object,
  }

  static defaultProps = {
    wrapperTag: 'div',
    wrapperTagProps: {}
  }

  lines(text) {
    const pattern = /([^\n]\n)(?=[^\n])/g;
    const lines = text.match(/[^\r\n]+/g);
    return lines;
  }

  render() {
    const { text, wrapperTag, wrapperTagProps, postfix } = this.props;
    const lines = this.lines(text);
    const children = (
      <p>
        {lines.map((line, index) => {
          const last = index === lines.length - 1 ? true : false;
          const after = last ? null : <br />;
          return (
            <span key={index}>{line}{after}</span>
          );
        })}
      </p>
    );
    return createElement(wrapperTag, wrapperTagProps, children);
  }
}
