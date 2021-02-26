import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import SectionLabel from "global/components/form/SectionLabel";

export default class ResourceImportControlsImporting extends PureComponent {
  static displayName = "ResourceImport.Controls.Importing";

  static propTypes = {
    resourceImport: PropTypes.object.isRequired,
    refreshResults: PropTypes.func
  };

  render() {
    const resourceImport = this.props.resourceImport;
    if (!resourceImport) return null;

    return (
      <>
        <SectionLabel
          label="Step 4. Import Resources"
        />
        <p className="instructional-copy">
          The import is in progress. Each resource is updated in the background.
          This list below will refresh every 5 seconds, or you can press the
          refresh button to manually update the results.
        </p>

        <div
          className="buttons-icon-horizontal"
          style={{
            marginTop: 30,
            marginBottom: 0
          }}
        >
          <button
            onClick={this.props.refreshResults}
            className="buttons-icon-horizontal__button button-icon-secondary"
          >
            <IconComposer
              icon="checkmark16"
              size="default"
              iconClass="button-icon-secondary__icon"
            />
            <span>Refresh Results</span>
          </button>
        </div>
      </>
    );
  }
}
