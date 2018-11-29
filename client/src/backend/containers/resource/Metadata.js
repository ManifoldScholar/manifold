import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Metadata from "backend/components/metadata";
import { resourcesAPI } from "api";

export default class ResourceMetadataContainer extends PureComponent {
  static displayName = "Resource.Metadata";

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
