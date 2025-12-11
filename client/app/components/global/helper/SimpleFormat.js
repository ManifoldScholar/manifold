import React, { lazy, Suspense, PureComponent, createElement } from "react";
import PropTypes from "prop-types";
import he from "he";
import { nl2br } from "utils/string";

const AutolinkedText = lazy(() =>
  import("autolinker").then(mod => ({
    default: function AutolinkedParagraph({ formatted }) {
      return (
        <p
          dangerouslySetInnerHTML={{
            __html: mod.default.link(formatted)
          }}
        />
      );
    }
  }))
);

const formattedText = props => {
  const sanitized = he.encode(props.text);
  const formatted = nl2br(sanitized);

  return (
    <Suspense fallback={<p dangerouslySetInnerHTML={{ __html: formatted }} />}>
      <AutolinkedText formatted={formatted} />
    </Suspense>
  );
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
