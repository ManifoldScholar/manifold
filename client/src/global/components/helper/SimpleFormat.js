import React, { PureComponent, createElement } from "react";
import PropTypes from "prop-types";
import nl2br from "nl2br";
import he from "he";
import Loadable from "@docusaurus/react-loadable";

const formattedText = props => {
  const sanitized = he.encode(props.text);
  const formatted = nl2br(sanitized);

  const Loaded = Loadable({
    loader: () => import(/* webpackChunkName: "autolinker" */ "autolinker"),
    render(autolinker) {
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: autolinker.link(formatted)
          }}
        />
      );
    },
    loading: () => <p dangerouslySetInnerHTML={{ __html: sanitized }} />
  });

  return <Loaded {...props} />;
};

formattedText.propTypes = {
  text: PropTypes.string.isRequired
};

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

  render() {
    const { wrapperTag, wrapperTagProps } = this.props;
    return createElement(
      wrapperTag,
      wrapperTagProps,
      formattedText(this.props)
    );
  }
}
