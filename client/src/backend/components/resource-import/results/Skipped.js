import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

class ResourceImportResultsSkipped extends PureComponent {
  static displayName = "ResourceImport.Results.Skipped";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    const t = this.props.t;
    if (!resourceImportRow) return null;

    return (
      <>
        <IconComposer
          icon="arrowRight16"
          size={18}
          className="results-header__icon"
        />
        <span>
          {t("resources.import.row_skipped", {
            number: resourceImportRow.lineNumber
          })}
        </span>
      </>
    );
  }
}

export default withTranslation()(ResourceImportResultsSkipped);
