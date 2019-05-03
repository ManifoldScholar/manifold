import React, { Component } from "react";
import PropTypes from "prop-types";
import truncate from "lodash/truncate";
import capitalize from "lodash/capitalize";

export default class IngestionHeader extends Component {
  static displayName = "Ingestion.Header";

  static propTypes = {
    ingestion: PropTypes.object,
    reingestion: PropTypes.bool
  };

  get currentState() {
    return capitalize(this.ingestion.attributes.state);
  }

  get ingestion() {
    return this.props.ingestion;
  }

  get strategy() {
    return this.ingestion.attributes.strategyLabel || "None";
  }

  get textId() {
    if (this.props.reingestion) return this.ingestion.attributes.textId;

    return "This ingestion will create a new text";
  }

  get title() {
    const title =
      this.ingestion.attributes.sourceFileName ||
      this.ingestion.attributes.externalSourceUrl;
    if (!title) return "";
    return truncate(title, { length: 40 });
  }

  render() {
    if (!this.props.ingestion) return null;

    return (
      <div className="backend-header">
        <div className="wrapper">
          <header className="entity-header-primary">
            <figure aria-hidden="true">
              <i className="manicon manicon-text-placeholder" />
            </figure>
            <div className="title">
              <h1>{this.title}</h1>
            </div>
          </header>
          <div className="properties">
            <div className="item">
              <p className="label">Current state</p>
              <p className="value">{this.currentState}</p>
            </div>
            <div className="item">
              <p className="label">Strategy</p>
              <p className="value">{this.strategy}</p>
            </div>
            <div className="item">
              <p className="label">Text ID</p>
              <p className="value">{this.textId}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
