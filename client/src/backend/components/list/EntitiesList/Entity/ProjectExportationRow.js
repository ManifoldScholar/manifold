import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import FormattedDate from "global/components/FormattedDate";
import EntityRow from "./Row";
import Utility from "global/components/utility";
import filesize from "filesize";
import { withTranslation } from "react-i18next";

class ProjectExportationRow extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  onDelete = event => {
    event.preventDefault();
    event.stopPropagation();
    this.props.onDelete(this.props.entity);
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

  get translateState() {
    const t = this.props.t;
    switch (this.currentState) {
      case "success":
        return t("projects.exports.tags.success");
      case "pending":
        return t("projects.exports.tags.pending");
      case "failure":
        return t("projects.exports.tags.failure");
      default:
        return null;
    }
  }

  get successMessage() {
    let size = "";
    if (this.attributes.packageSize) {
      size = this.props.t("projects.exports.project_size", {
        size: filesize(this.attributes.packageSize)
      });
    }

    return this.props.t("projects.exports.success_message", {
      target: this.exportTargetName,
      size
    });
  }

  get utility() {
    const url = this.attributes.packageUrl;
    if (!url) return null;
    return (
      <>
        <a
          className="entity-row__utility-button"
          href={url}
          title={this.props.t("actions.download")}
        >
          <Utility.IconComposer icon="arrowDown32" size={26} />
        </a>
        <button
          className="entity-row__utility-button"
          onClick={this.onDelete}
          title={this.props.t("projects.exports.delete_export")}
        >
          <Utility.IconComposer icon="delete32" size={26} />
        </button>
      </>
    );
  }

  get metadataReason() {
    if (this.metadata) return this.metadata.reason;
    return "";
  }

  get failureMessage() {
    return this.props.t("projects.exports.failure_message", {
      target: this.exportTargetName,
      reason: this.metadataReason
    });
  }

  get pendingMessage() {
    return this.props.t("projects.exports.pending_message", {
      target: this.exportTargetName,
      reason: this.metadataReason
    });
  }

  get labelLevel() {
    if (this.isSuccess) return "notice";
    if (this.isFailure) return "error";
    return null;
  }

  get label() {
    return {
      text: this.translateState,
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
        utility={this.utility}
      />
    );
  }
}

export default withTranslation()(ProjectExportationRow);
