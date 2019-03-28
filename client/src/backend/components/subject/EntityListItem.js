import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import { EntityRow } from "backend/components/list/EntitiesList";

export default class SubjectListItem extends PureComponent {
  static displayName = "Subject.ListItem";

  static propTypes = {
    entity: PropTypes.object,
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

  get name() {
    return this.subject.attributes.name;
  }

  render() {
    return (
      <EntityRow
        onRowClick={lh.link("backendSettingsSubject", this.id)}
        title={this.name}
        active={this.active}
      />
    );
  }
}
