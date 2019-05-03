import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import lh from "helpers/linkHandler";
import Controls from "./controls";

export default class ResourceImportState extends PureComponent {
  static displayName = "ResourceImport.State";

  static propTypes = {
    resourceImport: PropTypes.object,
    updateImportState: PropTypes.func.isRequired,
    match: PropTypes.object,
    fetch: PropTypes.func.isRequired
  };

  get backLinkUrl() {
    const { match } = this.props;
    return lh.link(
      "backendResourceImportMap",
      match.params.projectId,
      match.params.id
    );
  }

  get finishUrl() {
    const { match } = this.props;
    return lh.link("backendProjectResources", match.params.projectId);
  }

  refreshResults = () => {
    this.props.fetch();
  };

  resetImport = event => {
    event.preventDefault();
    this.props.updateImportState("mapped");
  };

  startImport = event => {
    event.preventDefault();
    this.props.updateImportState("importing");
  };

  render() {
    const resourceImport = this.props.resourceImport;
    if (!resourceImport) return null;

    switch (resourceImport.attributes.state) {
      case "importing":
        return (
          <Controls.Importing
            resourceImport={resourceImport}
            refreshResults={this.refreshResults}
          />
        );
      case "imported":
        return (
          <Controls.Imported
            resourceImport={resourceImport}
            finishUrl={this.finishUrl}
            resetImport={this.resetImport}
          />
        );
      case "parsed":
      case "mapped":
        return (
          <Controls.Parsed
            resourceImport={resourceImport}
            backLinkUrl={this.backLinkUrl}
            startImport={this.startImport}
          />
        );
      default:
        return null;
    }
  }
}
