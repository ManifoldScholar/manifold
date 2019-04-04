import React, { Component } from "react";
import PropTypes from "prop-types";
import truncate from "lodash/truncate";
import capitalize from "lodash/capitalize";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

export default class IngestionHeader extends Component {
  static displayName = "Ingestion.Header";

  static propTypes = {
    ingestion: PropTypes.object,
    reingestion: PropTypes.bool
  };

  get ingestion() {
    return this.props.ingestion;
  }

  get title() {
    const title =
      this.ingestion.attributes.sourceFileName ||
      this.ingestion.attributes.externalSourceUrl;
    if (!title) return "";
    return truncate(title, { length: 40 });
  }

  get currentState() {
    return capitalize(this.ingestion.attributes.state);
  }

  get strategy() {
    return this.ingestion.attributes.strategyLabel || "None";
  }

  get textId() {
    if (this.props.reingestion) return this.ingestion.attributes.textId;

    return "This ingestion will create a new text";
  }

  titleBlock() {
    return (
      <div className="backend-header__title-block">
        <h1 className="backend-header__title">{this.title}</h1>
      </div>
    );
  }

  figureBlock() {
    return (
      <figure
        className={classNames(
          "backend-header__figure-block",
          "backend-header__figure-block--shift-left"
        )}
      >
        <div className="backend-header__figure">
          <IconComposer
            icon="textsBook64"
            size={56}
            iconClass="backend-header__type-icon"
          />
        </div>
      </figure>
    );
  }

  render() {
    if (!this.props.ingestion) return null;

    const Property = props => (
      <div className="ingestion-output__item">
        <p className="ingestion-output__label">{props.label}</p>
        <p className="ingestion-output__value">{props.value}</p>
      </div>
    );

    return (
      <div className="backend-header">
        <div className="backend-header__inner">
          <header
            className={classNames(
              "backend-header__content-flex-wrapper",
              "backend-header__content-flex-wrapper--aib",
              "backend-header__content-flex-wrapper--tight"
            )}
          >
            {this.figureBlock()}
            {this.titleBlock()}
          </header>
          <div className="backend-header__body ingestion-output__properties">
            <Property label="Current state" value={this.currentState} />
            <Property label="Strategy" value={this.strategy} />
            <Property label="Text ID" value={this.textId} />
          </div>
        </div>
      </div>
    );
  }
}
