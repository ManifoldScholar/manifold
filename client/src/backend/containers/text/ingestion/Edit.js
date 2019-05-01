import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Ingestion from "backend/components/ingestion";
import { entityStoreActions } from "actions";
import { ingestionsAPI, requests } from "api";
import { select, isLoaded } from "utils/entityUtils";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export class IngestionEditContainer extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    if (isLoaded(requests.beIngestionShow, getState())) return;
    const call = ingestionsAPI.show(match.params.ingestionId);
    const ingestion = request(call, requests.beIngestionShow);
    return dispatch(ingestion);
  };

  static mapStateToProps = state => {
    return {
      ingestion: select(requests.beIngestionShow, state.entityStore)
    };
  };

  static displayName = "Text.Ingestion.Edit";

  static propTypes = {
    text: PropTypes.object.isRequired,
    history: PropTypes.object,
    ingestion: PropTypes.object,
    match: PropTypes.object,
    location: PropTypes.object
  };

  get textId() {
    return this.props.text.id;
  }

  handleSuccess = () => {
    this.redirectToIngestion(this.props.ingestion.id);
  };

  redirectToIngestion(ingestionId) {
    const path = lh.link(
      "backendTextIngestionIngest",
      this.textId,
      ingestionId
    );
    this.props.history.push(path, { back: this.props.match.url });
  }

  render() {
    return (
      <div>
        {this.props.ingestion ? (
          <Ingestion.Form.Wrapper
            ingestion={this.props.ingestion}
            location={this.props.location}
            history={this.props.history}
            name={requests.beIngestionCreate}
            project={this.props.text.relationships.project}
            onSuccess={this.handleSuccess}
          />
        ) : null}
      </div>
    );
  }
}

export default connectAndFetch(IngestionEditContainer);
