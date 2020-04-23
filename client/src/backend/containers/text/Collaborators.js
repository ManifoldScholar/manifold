import React, { Component } from "react";
import PropTypes from "prop-types";
import { makersAPI, textsAPI } from "api";
import { connect } from "react-redux";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";
import Form from "global/components/form";
import FormContainer from "global/containers/form";

export class TextCollaboratorsContainer extends Component {
  static displayName = "Text.Collaborators";

  static propTypes = {
    text: PropTypes.object,
    history: PropTypes.object.isRequired,
    refresh: PropTypes.func.isRequired,
    route: PropTypes.object
  };

  closeUrl(props) {
    return lh.link("backendTextCollaborators", props.text.id);
  }

  close = () => {
    this.props.refresh();
    this.props.history.push(this.closeUrl(this.props));
  };

  render() {
    const text = this.props.text;
    const closeUrl = this.closeUrl(this.props);

    // <CompositeInputs.Collaborators
    //   entity={text}
    //   api={textsAPI}
    //   history={this.props.history}
    //   route={this.props.route}
    // />

    return (
      <section>
        <FormContainer.Form
          debug
          style={{ marginBottom: 100 }}
          model={text}
          name="testing-project-collaborators"
          update={textsAPI.update}
          className="form-secondary"
        >
          <Form.Picker
            label="Authors"
            name="relationships[creators]"
            optionToLabel={maker => maker.attributes.fullName}
            callbacks={{}}
            predictive
            placeholder="Add an Author"
            listRowComponent="MakerRow"
            options={makersAPI.index}
          />
          <Form.Picker
            label="Contributors"
            name="relationships[contributors]"
            optionToLabel={maker => maker.attributes.fullName}
            callbacks={{}}
            predictive
            placeholder="Add a Contributor"
            listRowComponent="MakerRow"
            options={makersAPI.index}
          />
          <Form.Save />
        </FormContainer.Form>
        {childRoutes(this.props.route, {
          drawer: true,
          drawerProps: { closeUrl },
          childProps: { afterDestroy: this.close }
        })}
      </section>
    );
  }
}

export default connect(TextCollaboratorsContainer.mapStateToProps)(
  TextCollaboratorsContainer
);
