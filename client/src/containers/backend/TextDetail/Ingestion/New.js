import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Ingestion } from "components/backend";
import { requests } from "api";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";

export class IngestionNew extends PureComponent {
  static displayName = "TextDetail.Ingestion.New";

  static mapStateToProps = state => {
    return {
      ingestion: select(requests.beIngestionCreate, state.entityStore)
    };
  };

  static propTypes = {
    project: PropTypes.object,
    text: PropTypes.object,
    history: PropTypes.object,
    ingestion: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.ingestion !== nextProps.ingestion) {
      this.redirectToIngestion(nextProps.ingestion.id);
    }
  }

  redirectToIngestion(ingestionId) {
    const path = lh.link(
      "backendTextIngestionIngest",
      this.textId,
      ingestionId
    );
    this.props.history.push(path, { back: this.props.match.url });
  }

  get textId() {
    return this.props.text.id;
  }

  render() {
    return (
      <div>
        <Ingestion.Form.Wrapper
          location={this.props.location}
          history={this.props.history}
          name={requests.beIngestionCreate}
          project={this.props.text.relationships.project}
          text={this.props.text}
        />
      </div>
    );
  }
}

export default connectAndFetch(IngestionNew);
