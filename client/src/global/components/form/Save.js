import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import classNames from "classnames";

export default class FormSave extends Component {
  static displayName = "Form.Save";

  static propTypes = {
    text: PropTypes.string,
    cancelRoute: PropTypes.string
  };

  static defaultProps = {
    text: "Save"
  };

  render() {
    return (
      <div className="form-input submit wide">
        {this.props.cancelRoute ? (
          <Link
            to={this.props.cancelRoute}
            className={classNames(
              "button-secondary",
              "button-secondary--outlined",
              "button-secondary--dull"
            )}
          >
            {"Cancel"}
          </Link>
        ) : null}
        <input
          className={classNames(
            "button-secondary",
            "button-secondary--outlined"
          )}
          type="submit"
          value={this.props.text}
        />
      </div>
    );
  }
}
