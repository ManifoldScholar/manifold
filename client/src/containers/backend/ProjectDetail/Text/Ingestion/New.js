import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import connectAndFetch from 'utils/connectAndFetch';
import { Ingestion } from 'components/backend';
import { ingestionsAPI, requests } from 'api';
import { select, isLoaded } from 'utils/entityUtils';
import lh from 'helpers/linkHandler';

export class IngestionNew extends PureComponent {

  static displayName = "ProjectDetail.Text.Ingestion.New";

  static mapStateToProps(state) {
    return {
      ingestion: select(requests.beIngestionCreate, state.entityStore),
    };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    text: PropTypes.object,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.ingestion !== nextProps.ingestion) {
      this.redirectToIngestion(nextProps.ingestion.id);
    }
  }

  redirectToIngestion(ingestionId) {
    const path = lh.link(
      'backendProjectTextsIngestionIngest',
      this.projectId,
      ingestionId
    );
    this.props.history.push(path);
  }

  get projectId() {
    return this.props.project.id;
  }


  render() {
    return (
      <div>
        <Ingestion.Form.Wrapper
          location={this.props.location}
          history={this.props.history}
          name={requests.beIngestionCreate}
          project={this.props.project}
        />
      </div>
    );
  }
}

export default connectAndFetch(IngestionNew);
