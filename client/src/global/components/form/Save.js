import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { withTranslation } from "react-i18next";
import FieldWrapper from "./styled/FieldWrapper";

class FormSave extends Component {
  static displayName = "Form.Save";

  static propTypes = {
    text: PropTypes.string,
    cancelRoute: PropTypes.string,
    cancelCallback: PropTypes.func,
    theme: PropTypes.oneOf(["frontend", "backend", "reader"]),
    t: PropTypes.func
  };

  static defaultProps = {
    text: "Save",
    theme: "backend"
  };

  render() {
    const t = this.props.t;

    return (
      <FieldWrapper className="wide">
        {this.props.cancelRoute && (
          <Link
            to={this.props.cancelRoute}
            className={classNames({
              "button-secondary": true,
              "button-secondary--dull": true,
              "button-secondary--outlined": this.props.theme === "backend",
              "button-secondary--accent-pale": this.props.theme === "frontend"
            })}
          >
            {t("actions.cancel")}
          </Link>
        )}
        {this.props.cancelCallback && (
          <button
            type="button"
            onClick={this.props.cancelCallback}
            className={classNames({
              "button-secondary": true,
              "button-secondary--dull": true,
              "button-secondary--outlined": this.props.theme === "backend"
            })}
          >
            {t("actions.cancel")}
          </button>
        )}
        <input
          className={classNames({
            "button-secondary": true,
            "button-secondary--outlined": this.props.theme === "backend"
          })}
          type="submit"
          value={this.props.text}
        />
      </FieldWrapper>
    );
  }
}

export default withTranslation()(FormSave);
