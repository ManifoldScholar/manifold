import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import IconComposer from "global/components/utility/IconComposer";
import { withTranslation } from "react-i18next";

class ResourceImportResultsFailed extends PureComponent {
  static displayName = "ResourceImport.Results.Failed";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    const t = this.props.t;

    return (
      <>
        <IconComposer
          icon="close16"
          size={18}
          className="results-header__icon"
        />
        <span>
          {t("resources.import.row_failed", {
            number: resourceImportRow.lineNumber
          })}
        </span>
      </>
    );
  }
}

export default withTranslation()(ResourceImportResultsFailed);
