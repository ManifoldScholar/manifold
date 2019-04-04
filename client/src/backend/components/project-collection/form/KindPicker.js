import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "frontend/components/utility";

export default class KindPicker extends Component {
  static displayName = "ProjectCollection.Form.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    setOther: PropTypes.func
  };

  get isSmart() {
    return this.props.getModelValue("attributes[smart]");
  }

  handleSmartClick = () => {
    this.props.setOther(!this.isSmart, "attributes[smart]");
  };

  render() {
    const selected = this.isSmart ? "Smart" : "Manual";

    return (
      <div className="form-input">
        <div>
          <span className="screen-reader-text">
            Select a collection kind between smart or manual.
          </span>
          <Utility.Toggle
            handleToggle={this.handleSmartClick}
            selected={selected}
            label="kind"
            optionOne={{
              label: "Manual",
              icon: "BECollectionManual64"
            }}
            optionTwo={{
              label: "Smart",
              icon: "BECollectionSmart64"
            }}
          />
        </div>
      </div>
    );
  }
}
