import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import EntityRow from "./Row";

export default class ProjectExportationRow extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  get attributes() {
    return this.props.entity.attributes || {};
  }

  get metadata() {
    return this.attributes.metadata;
  }

  get currentState() {
    return this.attributes.currentState;
  }

  get targetPath() {
    return this.attributes.targetPath;
  }

  get exportTargetName() {
    const et = this.props.entity.relationships.exportTarget;
    return et.attributes.name;
  }

  get isSuccess() {
    return this.matchState("success");
  }

  get isPending() {
    return this.matchState("pending");
  }

  get isFailure() {
    return this.matchState("failure");
  }

  get successMessage() {
    return `Exported project to ${this.exportTargetName}`;
  }

  get metadataReason() {
    if (this.metadata) return this.metadata.reason;
    return "";
  }

  get failureMessage() {
    return `Failed to export project to ${this.exportTargetName}: ${this.metadataReason}`;
  }

  get pendingMessage() {
    return `Exporting project to ${this.exportTargetName}`;
  }

  get labelLevel() {
    if (this.isSuccess) return "notice";
    if (this.isFailure) return "error";
    return null;
  }

  get label() {
    return {
      text: this.currentState,
      level: this.labelLevel
    };
  }

  matchState(state) {
    return this.currentState === state;
  }

  get subtitle() {
    if (this.isSuccess) return this.successMessage;
    if (this.isFailure) return this.failureMessage;
    if (this.isPending) return this.pendingMessage;
  }

  render() {
    const {
      entity: {
        attributes: { createdAt, exportedAt }
      }
    } = this.props;

    return (
      <EntityRow
        rowClickMode="block"
        title={<FormattedDate date={createdAt || exportedAt} format="PPpp" />}
        label={this.label}
        meta={this.subtitle}
      />
    );
  }
}
