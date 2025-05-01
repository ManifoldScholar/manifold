import React, { Component } from "react";
import PropTypes from "prop-types";
import Utility from "frontend/components/utility";
import { withTranslation } from "react-i18next";
import * as Styled from "./styles";

class KindPicker extends Component {
  static displayName = "ProjectCollection.Form.KindPicker";

  static propTypes = {
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    t: PropTypes.func,
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
      ? t("project_collections.smart")
      : t("project_collections.manual");

    return (
      <Styled.Wrapper>
        <span className="screen-reader-text">
          {t("project_collections.collection_kind_instructions")}
        </span>
        <Utility.Toggle
          handleToggle={this.handleSmartClick}
          selected={selected}
          label="kind"
          optionOne={{
            label: t("project_collections.manual"),
            icon: "BECollectionManual64",
          }}
          optionTwo={{
            label: t("project_collections.smart"),
            icon: "BECollectionSmart64",
          }}
        />
      </Styled.Wrapper>
    );
  }
}

export default withTranslation()(KindPicker);
