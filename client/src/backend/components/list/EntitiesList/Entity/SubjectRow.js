import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import EntityRow from "./Row";

export default class SubjectRow extends PureComponent {
  static displayName = "EntitiesList.Entity.SubjectRow";

  static propTypes = {
    clickable: PropTypes.bool,
    entity: PropTypes.object,
    active: PropTypes.string
  };

  static defaultProps = {
    clickable: true
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

  get name() {
    return this.subject.attributes.name;
  }

  render() {
    const { clickable } = this.props;

    const additionalProps = {
      title: this.name,
      active: this.active
    };
    if (clickable) {
      additionalProps.onRowClick = lh.link("backendSettingsSubject", this.id);
      additionalProps.rowClickMode = "block";
    }

    return <EntityRow {...this.props} {...additionalProps} />;
  }
}
