import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import lh from "helpers/linkHandler";
import IconComposer from "global/components/utility/IconComposer";
import { Trans, withTranslation } from "react-i18next";

class ResourceImportResultsPending extends PureComponent {
  static displayName = "ResourceImport.Results.Pending";

  static propTypes = {
    resourceImportRow: PropTypes.object.isRequired,
    t: PropTypes.func
  };

  get icon() {
    return this.props.resourceImportRow.isSkip ? "arrowRight16" : "plus16";
  }

  renderMessage(resourceImportRow) {
    const t = this.props.t;

    if (resourceImportRow.isUpdate) {
      return (
        <span>
          <Trans
            i18nKey="resources.import.row_pending"
            components={{
              resourceLink: (
                <Link
                  to={lh.link("backendResource", resourceImportRow.resourceId)}
                />
              )
            }}
            values={{
              resourceTitle: resourceImportRow.resourceTitle,
              number: resourceImportRow.lineNumber
            }}
          />
        </span>
      );
    } else if (resourceImportRow.isSkip) {
      return (
        <span>
          {t("resources.import.row_will_skip", {
            number: resourceImportRow.lineNumber
          })}
        </span>
      );
    }
    return (
      <span>
        {t("resources.import.row_will_create", {
          number: resourceImportRow.lineNumber
        })}
      </span>
    );
  }

  render() {
    const resourceImportRow = this.props.resourceImportRow;
    if (!resourceImportRow) return null;

    return (
      <>
        <IconComposer
          icon={this.icon}
          size={18}
          className="results-header__icon"
        />
        {this.renderMessage(resourceImportRow)}
      </>
    );
  }
}

export default withTranslation()(ResourceImportResultsPending);
