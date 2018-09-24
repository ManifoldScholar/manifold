import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { sectionsAPI } from "api";
import { connect } from "react-redux";
import { entityStoreActions } from "actions";
import get from "lodash/get";
import Authorization from "helpers/authorization";

const { flush } = entityStoreActions;

export class StylesheetTextSections extends PureComponent {
  static mapStateToProps = state => {
    return {
      updateStylesheets: get(
        state.entityStore.responses,
        "update-textSections"
      ),
      authentication: state.authentication
    };
  };

  static displayName = "Stylesheet.Form.TextSections";

  static propTypes = {
    stylesheet: PropTypes.object,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    wide: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  componentWillUnmount() {
    this.props.dispatch(flush(["update-textSections"]));
  }

  fetchTextSections = () => {
    return sectionsAPI.forText(this.props.stylesheet.relationships.text.id);
  };

  render() {
    const stylesheet = this.props.stylesheet;
    if (!stylesheet) return null;

    return (
      <Form.HasMany
        label="Text Sections"
        placeholder="Add a Text Section"
        name="relationships[textSections]"
        fetch={this.fetchTextSections}
        entities={stylesheet.relationships.textSections}
        entityLabelAttribute={"name"}
        errors={get(this.props, "updateTextSections.errors")}
        searchable={false}
        wide
      />
    );
  }
}

export default connect(StylesheetTextSections.mapStateToProps)(
  StylesheetTextSections
);
