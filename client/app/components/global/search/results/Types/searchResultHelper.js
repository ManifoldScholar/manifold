import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import compact from "lodash/compact";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default function withSearchResultHelper(WrappedComponent) {
  const displayName = `HigherOrder.WithSearchResultHelper('${getDisplayName(
    WrappedComponent
  )})`;

  class WithSearchResultHelper extends PureComponent {
    static WrappedComponent = WrappedComponent;

    static displayName = displayName;

    static propTypes = {
      result: PropTypes.object
    };

    get childProps() {
      return {
        highlightedAttribute: this.highlightedAttribute,
        joinHighlightedFragments: this.joinHighlightedFragments
      };
    }

    joinHighlightedFragments = fragments => {
      return compact(fragments)
        .map(s => s.trim())
        .join("\u2026");
    };

    highlightedAttribute = key => {
      const { attributes } = this.props.result;
      const highlightedValue = attributes.highlights[key];
      if (highlightedValue) {
        const __html = this.joinHighlightedFragments(highlightedValue);
        return { __html };
      }
      return attributes[key];
    };

    render() {
      return React.createElement(WrappedComponent, {
        ...this.props,
        ...this.childProps
      });
    }
  }

  return WithSearchResultHelper;
}
