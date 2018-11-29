import React, { Component } from "react";
import PropTypes from "prop-types";
import { textsAPI } from "api";
import FormContainer from "backend/containers/form";
import { connect } from "react-redux";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

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
