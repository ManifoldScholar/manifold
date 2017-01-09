import React, { PureComponent, PropTypes } from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import { Form } from 'components/backend';
import startsWith from 'lodash/startsWith';
import brackets2dots from 'brackets2dots';
import classNames from 'classnames';

export default class Set extends PureComponent {

  static displayName = "Form.Connect.Set";

  static propTypes = {
    dirtyModel: PropTypes.object,
    sourceModel: PropTypes.object,
    name: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      set: PropTypes.func.isRequired
    }).isRequired,
    value: PropTypes.any,
    manualSet: PropTypes.bool
  };

  static defaultProps = {
    actions: { set: () => {} },
    manualSet: false
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  modelValue(model, name) {
    return get(model, this.path(name));
  }

  dirtyModelValue() {
    return this.modelValue(this.props.dirtyModel, this.props.name);
  }

  isChanged(model, name) {
    return has(model, this.path(name));
  }

  value() {
    if (this.props.value !== undefined) return this.props.value;
    let value;
    if (this.isChanged(this.props.dirtyModel, this.props.name)) {
      value = this.modelValue(this.props.dirtyModel, this.props.name);
    } else {
      value = this.modelValue(this.props.sourceModel, this.props.name);
    }
    // treat null values as empty strings for HTML forms
    if (value === null || value === undefined) value = "";
    return value;
  }

  setPath(name) {
    return `${this.path(name)}.$set`;
  }

  path(name) {
    return brackets2dots(name);
  }

  handleChange(event) {
    const value = this.valueFor(event.target);
    if (value === undefined) return;
    this.props.actions.set(this.props.sessionKey, this.setPath(this.props.name), value);
  }

  setValue(value, nameArg = null) {
    const name = nameArg === null ? this.props.name : nameArg;
    this.props.actions.set(this.props.sessionKey, this.setPath(name), value);
  }

  valueFor(element) {
    let value = element.value;
    if (isBoolean(this.props.value) || isBoolean(this.dirtyModelValue())) {
      if (value === 'true') value = true;
      if (value === 'false') value = false;
    }
    return value;
  }

  hasFixedValue() {
    return this.props.value !== undefined;
  }

  isChecked(inputValue) {
    let compare = inputValue;
    const value = this.dirtyModelValue();
    if (compare === "true" && isBoolean(value)) compare = true;
    if (compare === "false" && isBoolean(value)) compare = false;
    return compare === value;
  }

  childProps(child) {
    const props = {
      name: this.props.name,
      value: this.value(),
      onChange: this.handleChange
    };

    if (this.hasFixedValue()) props.checked = this.isChecked(this.value());
    if (this.props.manualSet === true) {
      props.setValue = this.setValue;
    }
    return Object.assign({}, child.props, props);
  }

  render() {
    const classes = classNames({
      checked: this.hasFixedValue() && this.isChecked(this.value())
    });
    let children;
    if (this.props.dirtyModel) {
      children = React.cloneElement(this.props.children, this.childProps(this.props.children));
    } else {
      children = this.props.children;
    }
    return (
      <div className={classes} ref={(wrapper) => { this.wrapper = wrapper; }}>
        <Form.HigherOrder.Validation {...this.childProps(this.props.children)} validation={this.props.validation} >
          {this.props.children}
        </Form.HigherOrder.Validation>
      </div>
    );
  }

}
