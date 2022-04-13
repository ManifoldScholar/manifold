import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import connectAndFetch from "utils/connectAndFetch";
import Ingestion from "backend/components/ingestion";
import { requests } from "api";
import { select } from "utils/entityUtils";
import lh from "helpers/linkHandler";

export class IngestionNewContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      ingestion: select(requests.beIngestionCreate, state.entityStore)
    };
  };

  static displayName = "Project.Text.Ingestion.New";

  static propTypes = {
    project: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    ingestion: PropTypes.object,
    triggerClose: PropTypes.func,
    t: PropTypes.func
  };

  componentDidUpdate(prevProps) {
    if (this.props.ingestion !== prevProps.ingestion) {
      this.redirectToIngestion(this.props.ingestion.id);
    }
  }

  get projectId() {
    return this.props.project.id;
  }

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
        <Ingestion.Form.Wrapper
          cancelUrl={lh.link("backendProjectTexts", this.projectId)}
          location={this.props.location}
          history={this.props.history}
          name={requests.beIngestionCreate}
          project={this.props.project}
          triggerClose={this.props.triggerClose}
          header={this.props.t("backend_entities.texts.add_text_label")}
        />
      </div>
    );
  }
}

export default withTranslation()(connectAndFetch(IngestionNewContainer));
