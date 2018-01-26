import React, { Component } from "react";
import PropTypes from "prop-types";
import { textsAPI } from "api";
import { Form as FormContainer } from "containers/backend";
import { connect } from "react-redux";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

export class TextCollaboratorsContainer extends Component {
  static displayName = "Text.Collaborators";

  static propTypes = {
    text: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object
  };

  render() {
    const text = this.props.text;
    const closeUrl = lh.link("backendTextCollaborators", text.id);

    return (
      <section>
        <FormContainer.Collaborators
          entity={text}
          api={textsAPI}
          history={this.props.history}
          route={this.props.route}
        />
        {childRoutes(this.props.route, {
          drawer: true,
          drawerProps: { closeUrl }
        })}
      </section>
    );
  }
}

export default connect(TextCollaboratorsContainer.mapStateToProps)(
  TextCollaboratorsContainer
);
