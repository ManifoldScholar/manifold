import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default class FormSave extends Component {
  static displayName = "Form.Save";

  static propTypes = {
    text: PropTypes.string,
    cancelRoute: PropTypes.string,
    theme: PropTypes.oneOf(["frontend", "backend", "reader"])
  };

  static defaultProps = {
    text: "Save",
    theme: "backend"
  };

  render() {
    return (
      <div className="form-input submit wide">
        {this.props.cancelRoute ? (
          <Link
            to={this.props.cancelRoute}
            className={classNames({
              "button-secondary": true,
              "button-secondary--dull": true,
              "button-secondary--outlined": this.props.theme === "backend",
              "button-secondary--accent-pale": this.props.theme === "frontend"
            })}
          >
            {"Cancel"}
          </Link>
        ) : null}
        <input
          className={classNames({
            "button-secondary": true,
            "button-secondary--outlined": this.props.theme === "backend",
            "button-secondary--accent-pale": this.props.theme === "frontend"
          })}
          type="submit"
          value={this.props.text}
        />
      </div>
    );
  }
}
