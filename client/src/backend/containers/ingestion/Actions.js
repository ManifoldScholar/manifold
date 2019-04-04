import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

export default class IngestionActions extends Component {
  static displayName = "Ingestion.Actions";

  static propTypes = {
    ingestion: PropTypes.object,
    connected: PropTypes.bool,
    start: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    complete: PropTypes.func.isRequired
  };

  get ingestion() {
    return this.props.ingestion;
  }

  get connected() {
    return this.props.connected;
  }

  get canCancel() {
    return !this.finished && !this.inProgress;
  }

  get finished() {
    return this.ingestion.attributes.state === "finished";
  }

  get inProgress() {
    return this.ingestion.attributes.state === "processing";
  }

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "button-icon-secondary"
    );
  }

  get startButton() {
    if (this.finished) return null;
    const label = this.inProgress ? "Ingesting" : "Start Ingestion";

    return (
      <button
        onClick={this.props.start}
        className={this.buttonClasses}
        disabled={this.inProgress}
      >
        <IconComposer
          icon="arrowDown16"
          size="default"
          iconClass="button-icon-secondary__icon"
        />
        <span>{label}</span>
      </button>
    );
  }

  get backButton() {
    if (this.finished) return null;

    return (
      <button
        onClick={this.props.cancel}
        className={classNames(
          this.buttonClasses,
          "button-icon-secondary--dull"
        )}
        disabled={this.inProgress}
      >
        <IconComposer
          icon="close16"
          size="default"
          iconClass="button-icon-secondary__icon"
        />
        <span>Change Source</span>
      </button>
    );
  }

  get completeButton() {
    if (!this.finished) return null;

    return (
      <button onClick={this.props.complete} className={this.buttonClasses}>
        <IconComposer
          icon="check16"
          size="default"
          iconClass="button-icon-secondary__icon"
        />
        <span>Complete</span>
      </button>
    );
  }

  render() {
    if (!this.ingestion || !this.connected) return null;

    return (
      <div className="ingestion-output__buttons buttons-icon-horizontal">
        {this.startButton}
        {this.completeButton}
        {this.backButton}
      </div>
    );
  }
}
