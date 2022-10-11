import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import SectionLabel from "global/components/form/SectionLabel";
import { withTranslation } from "react-i18next";

class ResourceImportControlsParsed extends PureComponent {
  static displayName = "ResourceImport.Controls.Parsed";

  static propTypes = {
    resourceImport: PropTypes.object,
    backLinkUrl: PropTypes.string,
    startImport: PropTypes.func,
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
          {t("resources.import.import_ready")}
        </p>

        <div
          className="buttons-icon-horizontal"
          style={{
            marginTop: 30,
            marginBottom: 0
          }}
        >
          <button
            onClick={this.props.startImport}
            className={this.buttonClasses}
          >
            <IconComposer
              icon="checkmark16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{t("resources.import.start_import")}</span>
          </button>
          <Link
            to={this.props.backLinkUrl}
            className={classNames(
              this.buttonClasses,
              "button-icon-secondary--dull"
            )}
          >
            <IconComposer
              icon="close16"
              size="default"
              className="button-icon-secondary__icon"
            />
            <span>{t("navigation.back")}</span>
          </Link>
        </div>
      </>
    );
  }
}

export default withTranslation()(ResourceImportControlsParsed);
