import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntityRow from "./Row";
import isObject from "lodash/isObject";
import isString from "lodash/isString";

export default class FormOptionRow extends PureComponent {
  static displayName = "EntitiesList.Entity.FormOptions";

  static propTypes = {
    entity: PropTypes.any,
    active: PropTypes.string
  };

  get subject() {
    return this.props.entity;
  }

  get id() {
    return this.subject.id;
  }

  get active() {
    return this.props.active === this.id;
  }

  compareValues(value, compareValue) {
    if (value === compareValue) return true;
    if (!isObject(value) || !isObject(compareValue)) return false;
    if (value.hasOwnProperty("id") && compareValue.hasOwnProperty("id"))
      return value.id === compareValue.id;
    return false;
  }

  get name() {
    const { options } = this.props;
    const option = options.find(o =>
      this.compareValues(o.originalValue, this.subject)
    );
    if (option) return option.label;
    if (isString(this.subject)) return this.subject;
    return null;
  }

  render() {
    const additionalProps = {
      title: this.name,
      active: this.active
    };
    return <EntityRow {...this.props} {...additionalProps} />;
  }
}
