import React, { Component } from "react";
import PropTypes from "prop-types";
import { Utility } from "components/frontend";
import setter from "components/backend/Form/setter";

class KindPicker extends Component {
  static displayName = "ProjectCollection.Form.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    setOther: PropTypes.func
  };

  isSmart() {
    return this.props.getModelValue("attributes[smart]");
  }

  handleSmartClick = () => {
    this.props.setOther(!this.isSmart(), "attributes[smart]");
  };

  render() {
    const selected = this.isSmart() ? "Smart Collection" : "Manual Collection";

    return (
      <div className="form-input">
        <div>
          <span className="screen-reader-text">
            Select a collection kind between smart or manual.
          </span>
          <Utility.Toggle
            handleToggle={this.handleSmartClick}
            selected={selected}
            optionOne={{
              label: "Manual Collection",
              iconClass: "manicon-collection-manual"
            }}
            optionTwo={{
              label: "Smart Collection",
              iconClass: "manicon-collection-smart"
            }}
          />
        </div>
      </div>
    );
  }
}

export default setter(KindPicker);
