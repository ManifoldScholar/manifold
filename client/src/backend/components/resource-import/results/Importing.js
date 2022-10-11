import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

class ResourceImportResultsImporting extends PureComponent {
  static displayName = "ResourceImport.Results.Importing";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;
    const t = this.props.t;

    return (
      <>
        <IconComposer
          icon="plus16"
          size={18}
          className="results-header__icon"
        />
        <span>
          {t("resources.import.row_importing", {
            number: resourceImportRow.lineNumber
          })}
        </span>
      </>
    );
  }
}

export default withTranslation()(ResourceImportResultsImporting);
