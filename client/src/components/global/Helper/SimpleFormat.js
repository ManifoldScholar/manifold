import React, { Component, PropTypes, createElement } from 'react'

export default class SimpleFormat extends Component {

  static propTypes = {
    text: PropTypes.string.isRequired,
    wrapperTag: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.object
    ]),
    wrapperTagProps: PropTypes.object,
    postfix: PropTypes.node
  }

  static defaultProps = {
    wrapperTag: 'div',
    wrapperTagProps: {}
  }

  paragraphs () {
    const pattern = /([^\n]\n)(?=[^\n])/g
    const text = this.props.text
    return text.replace(/\r\n?/g, '\n').split(/\n\n+/).map((t) => {
      if (t.match(pattern)) {
        return t.replace(pattern, '$1<br />')
      } else {
        return t
      }
    })
  }

  render () {
    const { wrapperTag, wrapperTagProps, postfix } = this.props
    return createElement(wrapperTag, wrapperTagProps, this.paragraphs().map((paragraph, index) => (
      (postfix && index === this.paragraphs().length - 1)
        ? <p key={ index }>
        <span dangerouslySetInnerHTML={{ __html: paragraph }} />
        { postfix }
      </p>
        : <p key={ index } dangerouslySetInnerHTML={{ __html: paragraph }} />
    )))
  }
}
