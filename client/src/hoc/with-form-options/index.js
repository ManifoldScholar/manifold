import React, { Component } from "react";
import PropTypes from "prop-types";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isBoolean from "lodash/isBoolean";
import setter from "backend/components/form/setter";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

function withFormOptions(WrappedComponent) {
  const displayName = `HigherOrder.WithFormContext('${getDisplayName(
    WrappedComponent
  )})`;

  class WithFormOptions extends Component {
    static WrappedComponent = WrappedComponent;
    static displayName = displayName;

    static propTypes = {
      name: PropTypes.string.isRequired,
      set: PropTypes.func.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.any.isRequired
        })
      ),
      value: PropTypes.any
    };

    static getDerivedStateFromProps(props, stateIgnored) {
      const options = props.options.map(option => {
        const { value, label } = option;
        const internalValue = WithFormOptions.toInternalValue(value);
        return { label, value, internalValue };
      });

      return { options };
    }

    static isSimpleValue(value) {
      return isString(value) || isNumber(value) || isBoolean(value);
    }

    static toInternalValue(value) {
      if (!value) return "";
      if (WithFormOptions.isSimpleValue(value)) return value;
      if (!value.hasOwnProperty("id"))
        throw new Error("Invalid option given to Select input");
      return value.id;
    }

    constructor(props) {
      super(props);
      this.state = { options: [] };
    }

    get childProps() {
      return {
        value: WithFormOptions.toInternalValue(this.props.value),
        options: this.state.options,
        onChange: this.handleChange
      };
    }

    byInternalValue(value) {
      const option = this.state.options.find(
        opt => value === opt.internalValue
      );
      return option.value;
    }

    handleChange = event => {
      return this.props.set(this.byInternalValue(event.target.value));
    };

    render() {
      return React.createElement(
        WrappedComponent,
        Object.assign({}, this.props, this.childProps)
      );
    }
  }

  return setter(WithFormOptions);
}

export default withFormOptions;
