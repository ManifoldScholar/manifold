import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "../setter";
import withDispatch from "hoc/with-dispatch";
import GlobalForm from "global/components/form";
import isString from "lodash/isString";
import Loadable from "react-loadable";

/* eslint-disable react/prop-types */
const CodeAreaInput = Loadable({
  loader: () =>
    import(/* webpackChunkName: "ace-editor" */ "./Ace").then(
      ace => ace.default
    ),
  render(Editor, props) {
    return (
      <div className="form-input">
        <GlobalForm.Errorable
          className="form-input"
          name={props.name}
          errors={props.errors}
          label={props.label}
        >
          <h4 className="form-input-heading">{props.label}</h4>
          {isString(props.instructions) ? (
            <span className="instructions">{props.instructions}</span>
          ) : null}
          <Editor {...props} />
        </GlobalForm.Errorable>
      </div>
    );
  },
  loading: () => null
});
/* eslint-enable react/prop-types */

class FormCodeArea extends Component {
  static displayName = "Form.CodeArea";

  static propTypes = {
    label: PropTypes.string,
    dispatch: PropTypes.func.isRequired,
    value: PropTypes.string,
    instructions: PropTypes.string,
    errors: PropTypes.array,
    set: PropTypes.func,
    height: PropTypes.string,
    name: PropTypes.string,
    readOnly: PropTypes.bool,
    mode: PropTypes.oneOf(["css", "javascript", "html"]).isRequired
  };

  static defaultProps = {
    height: "200px",
    readOnly: false
  };

  onChange = value => {
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
      width: "100%"
    };

    return <CodeAreaInput {...props} />;
  }
}

export default setter(withDispatch(FormCodeArea));
