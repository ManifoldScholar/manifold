import React, { Component } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";
import setter from "../setter";
import withDispatch from "hoc/withDispatch";

const CodeAreaInput = loadable(
  () => import(/* webpackChunkName: "ace-editor" */ "./AceEditor"),
);

class FormCodeArea extends Component {
  static displayName = "Form.CodeArea";

  static propTypes = {
    label: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    value: PropTypes.string,
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    errors: PropTypes.array,
    set: PropTypes.func,
    height: PropTypes.string,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    mode: PropTypes.oneOf(["css", "javascript", "html"]),
  };

  static defaultProps = {
    height: "200px",
    readOnly: false,
  };

  onChange = (value) => {
    this.props.set(value);
  };

  get value() {
    return this.props.value || "";
  }

  render() {
    const props = {
      ...this.props,
      theme: "idle_fingers",
      editorProps: { $blockScrolling: true },
      onChange: this.onChange,
      value: this.value,
      width: "100%",
    };

    return <CodeAreaInput {...props} />;
  }
}

export default setter(withDispatch(FormCodeArea));
