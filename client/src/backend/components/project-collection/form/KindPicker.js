import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "frontend/components/utility";
import { withTranslation } from "react-i18next";

class KindPicker extends Component {
  static displayName = "ProjectCollection.Form.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    t: PropTypes.func
  };

  get isSmart() {
    return this.props.getModelValue("attributes[smart]");
  }

  handleSmartClick = () => {
    this.props.setOther(!this.isSmart, "attributes[smart]");
  };

  render() {
    const t = this.props.t;
    const selected = this.isSmart
      ? t("backend.forms.project_collection.smart")
      : t("backend.forms.project_collection.manual");

    return (
      <div className="form-input">
        <div>
          <span className="screen-reader-text">
            {t("backend.forms.project_collection.collection_kind_instructions")}
          </span>
          <Utility.Toggle
            handleToggle={this.handleSmartClick}
            selected={selected}
            label="kind"
            optionOne={{
              label: t("backend.forms.project_collection.manual"),
              icon: "BECollectionManual64"
            }}
            optionTwo={{
              label: t("backend.forms.project_collection.smart"),
              icon: "BECollectionSmart64"
            }}
          />
        </div>
      </div>
    );
  }
}

export default withTranslation()(KindPicker);
