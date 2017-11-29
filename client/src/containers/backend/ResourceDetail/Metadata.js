import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Metadata } from "components/backend";
import { resourcesAPI } from "api";

export default class ResourceDetailMetadataContainer extends PureComponent {
  static displayName = "ResourceDetail.Metadata";

  static propTypes = {
    resource: PropTypes.object,
    params: PropTypes.object
  };

  render() {
    return (
      <Metadata.Form
        model={this.props.resource}
        name="backend-resource-metadata"
        update={resourcesAPI.update}
        create={resourcesAPI.create}
        className="form-secondary"
      />
    );
  }
}
