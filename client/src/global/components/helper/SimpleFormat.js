import React, { PureComponent, createElement } from "react";
import PropTypes from "prop-types";
import he from "he";
import loadable from "@loadable/component";
import { nl2br } from "utils/string";

const Loaded = loadable.lib(
  () => import(/* webpackChunkName: "autolinker" */ "autolinker"),
);

const formattedText = (props) => {
  const sanitized = he.encode(props.text);
  const formatted = nl2br(sanitized);

  return (
    <Loaded>
      {({ default: autolinker }) => (
        <p
          dangerouslySetInnerHTML={{
            __html: autolinker.link(formatted),
          }}
        />
      )}
    </Loaded>
  );
};

formattedText.propTypes = {
  text: PropTypes.string.isRequired,
};

export default class SimpleFormat extends PureComponent {
  static propTypes = {
    text: PropTypes.string.isRequired,
    wrapperTag: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    postfix: PropTypes.string,
    wrapperTagProps: PropTypes.object,
  };

  static defaultProps = {
    wrapperTag: "div",
    wrapperTagProps: {},
  };

  render() {
    const { wrapperTag, wrapperTagProps } = this.props;
    return createElement(
      wrapperTag,
      wrapperTagProps,
      formattedText(this.props),
    );
  }
}
