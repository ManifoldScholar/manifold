import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";

export default class ResourceImportControlsParsed extends PureComponent {
  static displayName = "ResourceImport.Controls.Parsed";

  static propTypes = {
    resourceImport: PropTypes.object,
    backLinkUrl: PropTypes.string,
    startImport: PropTypes.func
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

    return (
      <React.Fragment>
        <header className="form-section-label">
          <span>Step 4. Import Resources</span>
        </header>
        <p className="instructional-copy">
          {`The import is ready to begin. The list below is a preview of what will
          happen. Press the \u0022start import\u0022 button below to begin.`}
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
              icon="check16"
              size="default"
              iconClass="button-icon-secondary__icon"
            />
            <span>Start Import</span>
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
              iconClass="button-icon-secondary__icon"
            />
            <span>Back</span>
          </Link>
        </div>
      </React.Fragment>
    );
  }
}
