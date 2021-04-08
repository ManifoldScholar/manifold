import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import mapKeys from "lodash/mapKeys";
import humps from "humps";
import startsWith from "lodash/startsWith";
import smoothScroll from "../../../../../utils/smoothScroll";
import attrConvert from "react-attr-converter";

export default RenderComponent => {
  class ValidatedNode extends Component {
    static propTypes = {
      children: PropTypes.array,
      attributes: PropTypes.object,
      tag: PropTypes.string,
      textDigest: PropTypes.string,
      nodeUuid: PropTypes.string,
      openAnnotations: PropTypes.object,
      scrollToView: PropTypes.bool,
      scrollKey: PropTypes.string
    };

    componentDidMount() {
      if (this.props.scrollToView) {
        this.scrollToEl();
      }
    }

    componentDidUpdate(prevProps) {
      if (
        this.props.scrollToView &&
        this.props.scrollKey !== prevProps.scrollKey
      ) {
        this.scrollToEl();
      }
    }

    /* eslint-disable react/no-find-dom-node */
    scrollToEl() {
      // Normally we want to avoid finding the DOM node for an element. However, we can't
      // rely on every child node to return the dom node instead of a ref to a react
      // component, so we're going to do a double check here.
      if (this.el) {
        const domEl = ReactDOM.findDOMNode(this.el);
        if (domEl) {
          smoothScroll(domEl, 100);
          domEl.focus({ preventScroll: true });
        }
      }
    }
    /* eslint-enabnle react/no-find-dom-node */

    styleStringToObject(stylesString) {
      const declarations = stylesString.split(";");
      const object = declarations.reduce((previous, value) => {
        const parts = value.split(":");
        const styleProp = humps.camelize(parts[0]);
        previous[styleProp] = parts[1]; // eslint-disable-line no-param-reassign
        return previous;
      }, {});
      return object;
    }

    cleanAttributes(attr) {
      const mapped = mapKeys(attr, (attributeValue, attributeName) => {
        if (startsWith(attributeName, "data")) {
          return humps.decamelize(attributeName, { separator: "-" });
        }
        return attrConvert(attributeName);
      });
      if (mapped.hasOwnProperty("style")) {
        mapped.style = this.styleStringToObject(mapped.style);
      }
      return mapped;
    }

    render() {
      const attributes = this.cleanAttributes(this.props.attributes);

      // We need to keep track of the child's dom element so that we can scroll to it.
      attributes.ref = el => (this.el = el);

      return (
        <RenderComponent
          attributes={attributes}
          tag={this.props.tag}
          textDigest={this.props.textDigest}
          nodeUuid={this.props.nodeUuid}
          openAnnotations={this.props.openAnnotations}
          {...this.state}
        >
          {this.props.children}
        </RenderComponent>
      );
    }
  }

  return ValidatedNode;
};
