import React, { PureComponent, PropTypes } from 'react';
import get from 'lodash/get';
import isBoolean from 'lodash/isBoolean';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';
import brackets2dots from 'brackets2dots';
import classNames from 'classnames';

export default class Set extends PureComponent {

  static displayName = "Form.Connect.Set";

  static propTypes = {
    dirtyModel: PropTypes.object,
    name: PropTypes.string.isRequired,
    actions: PropTypes.shape({
      set: PropTypes.func.isRequired
    }).isRequired,
    value: PropTypes.any
  };

  static defaultProps = {
    actions: { set: () => {} }
  }

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  dirtyModelValue() {
    return get(this.props.dirtyModel, this.path());
  }

  value() {
    if (this.props.value !== undefined) return this.props.value;
    let value = this.dirtyModelValue();
    if (value === null) value = ""; // treat null values as empty strings for HTML forms
    return value;
  }

  setPath() {
    return `${this.path()}.$set`;
  }

  path() {
    return brackets2dots(this.props.name);
  }

  handleChange(event) {
    const value = this.valueFor(event.target);
    if (value === undefined) return;
    this.props.actions.set(this.props.sessionKey, this.setPath(), value);
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

  childProps() {
    const childProps = {
      name: this.props.name,
      value: this.value(),
      onChange: this.handleChange
    };
    if (this.hasFixedValue()) {
      childProps.checked = this.isChecked(this.value());
    }
    const out = Object.assign({}, this.props.children.props, childProps);
    return out;
  }

  render() {
    const classes = classNames({
      checked: this.hasFixedValue() && this.isChecked(this.value())
    });
    let children;
    if (this.props.dirtyModel) {
      children = React.cloneElement(this.props.children, this.childProps());
    } else {
      children = this.props.children;
    }
    return (
      <div className={classes} ref={(wrapper) => { this.wrapper = wrapper; }}>
        {children}
      </div>
    );
  }

}
