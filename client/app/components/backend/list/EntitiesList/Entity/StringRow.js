import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EntityRow from "./Row";

export default class StringRow extends PureComponent {
  static displayName = "EntitiesList.Entity.StringRow";

  static propTypes = {
    entity: PropTypes.string,
    active: PropTypes.string
  };

  get entity() {
    return this.props.entity;
  }

  get active() {
    return this.props.active === this.entity;
  }

  get name() {
    return this.entity;
  }

  render() {
    const additionalProps = {
      title: this.entity,
      active: this.active
    };

    return <EntityRow {...this.props} {...additionalProps} />;
  }
}
