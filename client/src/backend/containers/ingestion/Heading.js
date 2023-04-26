import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import truncate from "lodash/truncate";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

class IngestionHeader extends Component {
  static displayName = "Ingestion.Header";

  static propTypes = {
    ingestion: PropTypes.object,
    reingestion: PropTypes.bool,
    t: PropTypes.func
  };

  get ingestion() {
    return this.props.ingestion;
  }

  get title() {
    const title =
      this.ingestion.attributes.sourceFileName ||
      this.ingestion.attributes.externalSourceUrl;
    if (!title) return "";
    return truncate(title, { length: 30 });
  }

  get currentState() {
    return this.props.t(
      `texts.ingestion.states.${this.ingestion.attributes.state}`
    );
  }

  get strategy() {
    return (
      this.ingestion.attributes.strategyLabel ||
      this.props.t("texts.ingestion.no_strategy")
    );
  }

  get entityId() {
    const { textId, textSectionId } = this.ingestion.attributes ?? {};

    if (this.props.sectionIngest)
      return (
        textSectionId ?? this.props.t("texts.section.ingest_id_placeholder")
      );

    return textId ?? this.props.t("texts.ingestion.id_placeholder");
  }

  titleBlock() {
    return (
      <div className="ingest-header__title-block">
        <h1 className="ingest-header__title">{this.title}</h1>
      </div>
    );
  }

  figureBlock() {
    return (
      <figure
        className={classNames(
          "ingest-header__figure-block",
          "ingest-header__figure-block--shift-left"
        )}
      >
        <div className="ingest-header__figure">
          <IconComposer
            icon="textsBook64"
            size={56}
            className="ingest-header__type-icon"
          />
        </div>
      </figure>
    );
  }

  render() {
    if (!this.props.ingestion) return null;

    const idLabelKey = this.props.sectionIngest
      ? "texts.section.ingest_id_label"
      : "texts.ingestion.id_label";

    const Property = props => (
      <div className="ingestion-output__item">
        <p className="ingestion-output__label">{props.label}</p>
        <p className="ingestion-output__value">{props.value}</p>
      </div>
    );

    return (
      <div className="ingest-header">
        <div className="ingest-header__inner">
          <header
            className={classNames(
              "ingest-header__content-flex-wrapper",
              "ingest-header__content-flex-wrapper--aib",
              "ingest-header__content-flex-wrapper--tight"
            )}
          >
            {this.figureBlock()}
            {this.titleBlock()}
          </header>
          <div
            aria-live="polite"
            aria-atomic
            className="ingest-header__body ingestion-output__properties"
          >
            <Property
              label={this.props.t("texts.ingestion.current_state_label")}
              value={this.currentState}
            />
            <Property
              label={this.props.t("texts.ingestion.strategy_label")}
              value={this.strategy}
            />
            <Property label={this.props.t(idLabelKey)} value={this.entityId} />
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(IngestionHeader);
