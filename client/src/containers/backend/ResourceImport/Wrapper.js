import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Navigation, Layout } from "components/backend";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";
import { childRoutes } from "helpers/router";
import { resourceImportsAPI, projectsAPI, requests } from "api";
import { grab, isEntityLoaded, select } from "utils/entityUtils";
import { entityStoreActions } from "actions";

const { request } = entityStoreActions;

export class ResourceImportWrapper extends PureComponent {
  static fetchData = (getState, dispatch, location, match) => {
    if (isEntityLoaded("resourceImports", match.params.id, getState())) return;
    if (!match.params.projectId || !match.params.id) return;
    const call = resourceImportsAPI.show(
      match.params.projectId,
      match.params.id
    );
    const resourceImport = request(call, requests.beResourceImportFetch);
    return dispatch(resourceImport);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      resourceImport: grab(
        "resourceImports",
        ownProps.match.params.id,
        state.entityStore
      ),
      project: select(requests.feProject, state.entityStore)
    };
  };
  static displayName = "ResourceImport.Wrapper";
  static propTypes = {
    history: PropTypes.object,
    match: PropTypes.object,
    project: PropTypes.object,
    resourceImport: PropTypes.object,
    route: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      fileLoaded: false
    };
  }

  componentDidMount() {
    this.fetchProject();
  }

  fetchProject() {
    const call = projectsAPI.show(this.props.match.params.projectId);
    const projectRequest = request(call, requests.feProject);
    this.props.dispatch(projectRequest);
  }

  fetch = () => {
    const { match, dispatch } = this.props;
    const call = resourceImportsAPI.show(
      match.params.projectId,
      match.params.id
    );
    const resourceImport = request(call, requests.beResourceImportFetch);
    return dispatch(resourceImport);
  };

  create = model => {
    const { match } = this.props;
    return resourceImportsAPI.create(match.params.projectId, model);
  };

  executeUpdate = attributes => {
    const { dispatch } = this.props;
    const call = this.update(null, attributes);
    const resourceImport = request(call, requests.beResourceImportFetch);
    return dispatch(resourceImport);
  };

  update = (idIgnored, model) => {
    const { match } = this.props;
    return resourceImportsAPI.update(
      match.params.projectId,
      match.params.id,
      model
    );
  };

  renderRoutes() {
    const { match, project, resourceImport } = this.props;
    if (match.params.id && !resourceImport) return null;
    const childProps = {
      project,
      resourceImport,
      fetch: this.fetch,
      create: this.create,
      update: this.update,
      executeUpdate: this.executeUpdate
    };
    return childRoutes(this.props.route, { childProps });
  }

  render() {
    const { project, match } = this.props;
    if (!project) return null;

    return (
      <HigherOrder.Authorize
        entity={project}
        failureFatalError={{
          body: "You are not allowed to import resources for this project."
        }}
        ability={["update"]}
      >
        <Navigation.DetailHeader
          type="resources"
          backUrl={lh.link("backendProjectResources", match.params.projectId)}
          backLabel={project.attributes.title}
          title={"Bulk Add Resources"}
          showUtility={false}
          note={`Import resources from CSV or Google Sheet, with file assets stored in a
          google drive folder.`}
        />
        <Layout.BackendPanel>
          <div>{this.renderRoutes()}</div>
        </Layout.BackendPanel>
      </HigherOrder.Authorize>
    );
  }
}

export default connectAndFetch(ResourceImportWrapper);
