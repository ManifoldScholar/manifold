import React, { Component } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import connectAndFetch from "utils/connectAndFetch";
import ApiDocs from "frontend/components/ApiDocs";
import config from "config";

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
    return `${config.services.api}/api-docs/v1/swagger.json`;
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
      <section className="bg-neutral05">
        <div className="container flush entity-section-wrapper">
          <div className="section-heading entity-section-wrapper__heading">
            <div className="main" style={{ width: "100%" }}>
              <IconComposer icon="settings32" size="default" />
              <div className="body">
                <h2 className="title">
                  Manifold API {this.state.schema.info.version} Documentation
                </h2>
              </div>
            </div>
          </div>
          <div className="entity-section-wrapper__body">
            <div className="entity-section-wrapper__details">
              <p className="description">
                {`Nearly all changes to data stored in a Manifold installation occur over
                Manifold's API with a base URL of `}
                <em>
                  {config.services.api}
                  {this.state.schema.basePath}
                </em>
                {`. `}
                {`The API is a `}
                <a href="https://en.wikipedia.org/wiki/Representational_state_transfer">
                  REST API
                </a>
                {` with ${this.endpointCounts} distinct endpoints. It strives to conform
                to the `}
                <a href="https://jsonapi.org/">JSON:API</a>
                {` specification.`}
              </p>
              <p className="description">
                {authentication.authenticated ? (
                  <>
                    {` You are currently sending API requests as `}
                    <strong>
                      {authentication.currentUser.attributes.fullName}
                    </strong>
                    {`. `}
                  </>
                ) : (
                  "You are not currently logged in."
                )}
                {`Any requests you send to this instance using the documentation below
                  will be sent on your behalf and will operate on the current data for `}
                <a href={config.services.api}>{config.services.api}</a>
                {`, so
                  proceed with caution.`}
              </p>
              <p className="description">
                {`Manifold's API documentation follows the `}
                <a href="https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md">
                  OpenAPI {this.state.schema.swagger}
                </a>
                {` specification. The JSON schema file for Manifold's API is available at `}
                <a target="top" href={this.url}>
                  {this.url}
                </a>
              </p>
            </div>

            <ApiDocs
              schema={this.state.schema}
              authToken={authentication.authToken}
            />
          </div>
        </div>
      </section>
    );
  }
}

export default connectAndFetch(Api);
