import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import SectionLabel from "global/components/form/SectionLabel";
import { withTranslation } from "react-i18next";

class ResourceImportControlsImported extends PureComponent {
  static displayName = "ResourceImport.Controls.Imported";

  static propTypes = {
    resourceImport: PropTypes.object,
    resetImport: PropTypes.func,
    finishUrl: PropTypes.string,
    t: PropTypes.func
  };

  get buttonClasses() {
    return classNames(
      "buttons-icon-horizontal__button",
      "button-icon-secondary"
    );
  }

  render() {
    const resourceImport = this.props.resourceImport;
    if (!resourceImport) return null;
    const t = this.props.t;

    return (
      <>
        <SectionLabel label={t("resources.import.step_four")} />
        <p className="instructional-copy">
          {t("resources.import.import_complete")}
        </p>

        <div
          className="buttons-icon-horizontal"
          style={{
            marginTop: 30,
            marginBottom: 0
          }}
        >
          <Link to={this.props.finishUrl} className={this.buttonClasses}>
            <IconComposer
              icon="arrowLeft16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{t("resources.import.back_to_resources")}</span>
          </Link>
          <button
            onClick={this.props.resetImport}
            className={classNames(
              this.buttonClasses,
              "button-icon-secondary--dull"
            )}
          >
            <IconComposer
              icon="checkmark16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{t("resources.import.reset_import")}</span>
          </button>
        </div>
      </>
    );
  }
}

export default withTranslation()(ResourceImportControlsImported);
