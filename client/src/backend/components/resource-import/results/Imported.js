import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { Trans } from "react-i18next";

export default class ResourceImportResultsImported extends PureComponent {
  static displayName = "ResourceImport.Results.Imported";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired
  };

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    return (
      <>
        <IconComposer
          icon="checkmark16"
          size={18}
          className="results-header__icon"
        />
        <span>
          {resourceImportRow.isUpdate ? (
            <Trans
              i18nKey="resources.import.row_updated"
              components={{
                resourceLink: (
                  <Link
                    to={lh.link(
                      "backendResource",
                      resourceImportRow.resourceId
                    )}
                  />
                )
              }}
              values={{
                resourceTitle: resourceImportRow.resourceTitle,
                number: resourceImportRow.lineNumber
              }}
            />
          ) : (
            <Trans
              i18nKey="resources.import.row_created"
              components={{
                resourceLink: (
                  <Link
                    to={lh.link(
                      "backendResource",
                      resourceImportRow.resourceId
                    )}
                  />
                )
              }}
              values={{
                resourceTitle: resourceImportRow.resourceTitle,
                number: resourceImportRow.lineNumber
              }}
            />
          )}
        </span>
      </>
    );
  }
}
