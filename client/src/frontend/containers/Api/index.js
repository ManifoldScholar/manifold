import React, { Component } from "react";
import connectAndFetch from "utils/connectAndFetch";
import ApiDocs from "frontend/components/ApiDocs";
import config from "config";
import EntityCollection from "frontend/components/entity/Collection/EntityCollection";

class Api extends Component {
  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      authentication: state.authentication
    };
  };

  constructor(props) {
    super(props);
    this.state = { schema: null };
  }

  componentDidMount() {
    this.fetchSchema();
  }

  get url() {
    return `${config.services.api}/api/static/docs/v1/swagger.json`;
  }

  fetchSchema() {
    fetch(this.url).then(response => {
      response.json().then(schema => {
        this.setState({ schema: this.adjustedSchema(schema) });
      });
    });
  }

  get endpointCounts() {
    if (!this.state.schema) return 0;
    let count = 0;
    Object.keys(this.state.schema.paths).forEach(path => {
      count += Object.keys(this.state.schema.paths[path]).length;
    });
    return count;
  }

  /* eslint-disable no-param-reassign */
  adjustedSchema(schema) {
    delete schema.host;
    return schema;
  }
  /* eslint-enable no-param-reassign */

  render() {
    if (!this.state.schema) return null;
    const { authentication } = this.props;

    return (
      <EntityCollection
        title={`Manifold API ${this.state.schema.info.version} Documentation`}
        icon="settings32"
        description={`
            <p className="description">
              Nearly all changes to data stored in a Manifold installation occur over
              Manifold's API with a base URL of <em>${config.services.api}${
          this.state.schema.basePath
        }</em>.
              The API is a <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">
                REST API
              </a>
              with ${
                this.endpointCounts
              } distinct endpoints. It strives to conform to the
              <a href="https://jsonapi.org/">JSON:API</a> specification.
            </p>
            <p className="description">
              ${
                authentication.authenticated
                  ? `You are currently sending API requests as <strong>${authentication.currentUser.attributes.fullName}</strong>.`
                  : `<strong>You are not currently logged in.</strong>`
              }
              Any requests you send to this instance using the documentation below
              will be sent with your current authorization token and will operate on the current data for
              <a href="${config.services.api}">${
          config.services.api
        }</a> so proceed with caution.
            </p>
            <p className="description">
              Manifold's API documentation follows the <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md">
                OpenAPI ${this.state.schema.swagger}
              </a>
              specification. The JSON schema file for Manifold's API is available at
              <a target="top" href=${this.url}>
                ${this.url}
              </a>
            </p>
          `}
        headerLayout="title_description"
        BodyComponent={() => (
          <ApiDocs
            schema={this.state.schema}
            authToken={authentication.authToken}
          />
        )}
      />
    );
  }
}

export default connectAndFetch(Api);
