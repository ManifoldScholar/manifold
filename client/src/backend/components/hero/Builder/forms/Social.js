import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";

export default class Social extends PureComponent {
  static displayName = "Hero.Builder.Forms.Social";

  static propTypes = {
    model: PropTypes.object.isRequired,
    modelLabel: PropTypes.string.isRequired,
    api: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func,
    failureRedirectRoute: PropTypes.string.isRequired,
    headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };

  get model() {
    return this.props.model;
  }

  closeDrawer = () => {
    if (!this.props.closeDrawer) return;
    this.props.closeDrawer();
  };

  render() {
    const { failureRedirectRoute, headerId, api, modelLabel } = this.props;

    return (
      <Authorize
        entity={this.model}
        ability="update"
        failureNotification
        failureRedirect={lh.link(failureRedirectRoute, this.model.id)}
      >
        <section>
          <Navigation.DrawerHeader
            icon="projects64"
            title="Social Links"
            headerId={headerId}
          />
          <FormContainer.Form
            model={this.model}
            name="backend-hero-update"
            update={api.update}
            create={api.create}
            onSuccess={this.closeDrawer}
            className="form-secondary"
          >
            <Form.TextInput
              label="Hashtag"
              name="attributes[hashtag]"
              placeholder={`Enter ${modelLabel} Hashtag`}
            />
            <Form.TextInput
              label="Facebook ID"
              name="attributes[facebookId]"
              placeholder={`Enter ${modelLabel} Facebook ID`}
            />
            <Form.TextInput
              label="Twitter ID"
              name="attributes[twitterId]"
              placeholder={`Enter ${modelLabel} Twitter ID`}
            />
            <Form.TextInput
              label="Instagram ID"
              name="attributes[instagramId]"
              placeholder={`Enter ${modelLabel} Instagram ID`}
            />
            <Form.Save text="Save" />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}
