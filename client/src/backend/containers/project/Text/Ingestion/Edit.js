import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import Ingestion from "backend/components/ingestion";
import { entityStoreActions } from "actions";
import { ingestionsAPI, requests } from "api";
import { select, isLoaded } from "utils/entityUtils";

const { request } = entityStoreActions;
import lh from "helpers/linkHandler";

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

  static displayName = "Project.Text.Ingestion.Edit";

  static propTypes = {
    project: PropTypes.object.isRequired,
    ingestion: PropTypes.object,
    history: PropTypes.object,
    location: PropTypes.object
  };

  get projectId() {
    return this.props.project.id;
  }

  handleSuccess = () => {
    this.redirectToIngestion(this.props.ingestion.id);
  };

  redirectToIngestion(ingestionId) {
    const path = lh.link(
      "backendProjectTextsIngestionIngest",
      this.projectId,
      ingestionId
    );
    this.props.history.push(path);
  }

  render() {
    return (
      <div>
        {this.props.ingestion ? (
          <Ingestion.Form.Wrapper
            cancelUrl={lh.link("backendProjectTexts", this.projectId)}
            ingestion={this.props.ingestion}
            location={this.props.location}
            history={this.props.history}
            name={requests.beIngestionCreate}
            project={this.props.project}
            onSuccess={this.handleSuccess}
          />
        ) : null}
      </div>
    );
  }
}

export default connectAndFetch(IngestionEditContainer);
