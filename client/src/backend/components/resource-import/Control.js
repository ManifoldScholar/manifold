import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Controls from "./controls";
import lh from "helpers/linkHandler";

export default class ResourceImportState extends PureComponent {
  static displayName = "ResourceImport.State";

  static propTypes = {
    resourceImport: PropTypes.object,
    updateImportState: PropTypes.func.isRequired,
    match: PropTypes.object,
    fetch: PropTypes.func.isRequired
  };

  get finishUrl() {
    const { match } = this.props;
    return lh.link("backendProjectResources", match.params.projectId);
  }

  get backLinkUrl() {
    const { match } = this.props;
    return lh.link(
      "backendResourceImportMap",
      match.params.projectId,
      match.params.id
    );
  }

  resetImport = event => {
    event.preventDefault();
    this.props.updateImportState("mapped");
  };

  startImport = event => {
    event.preventDefault();
    this.props.updateImportState("importing");
  };

  refreshResults = () => {
    this.props.fetch();
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
