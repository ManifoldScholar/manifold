import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import SectionLabel from "global/components/form/SectionLabel";
import { withTranslation } from "react-i18next";

class ResourceImportControlsImporting extends PureComponent {
  static displayName = "ResourceImport.Controls.Importing";

  static propTypes = {
    resourceImport: PropTypes.object.isRequired,
    refreshResults: PropTypes.func,
    t: PropTypes.func
  };

  render() {
    const resourceImport = this.props.resourceImport;
    if (!resourceImport) return null;
    const t = this.props.t;

    return (
      <>
        <SectionLabel label={t("resources.import.step_four")} />
        <p className="instructional-copy">
          {t("resources.import.import_in_progress")}
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
              className="button-icon-secondary__icon"
            />
            <span>{t("resources.import.refresh_results")}</span>
          </button>
        </div>
      </>
    );
  }
}

export default withTranslation()(ResourceImportControlsImporting);
