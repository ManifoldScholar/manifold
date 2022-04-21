import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import FormContainer from "global/containers/form";
import Authorize from "hoc/Authorize";
import lh from "helpers/linkHandler";
import Navigation from "backend/components/navigation";
import { withTranslation } from "react-i18next";

class Social extends PureComponent {
  static displayName = "Hero.Builder.Forms.Social";

  static propTypes = {
    model: PropTypes.object.isRequired,
    modelLabel: PropTypes.string.isRequired,
    api: PropTypes.object.isRequired,
    closeDrawer: PropTypes.func,
    failureRedirectRoute: PropTypes.string.isRequired,
    headerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    t: PropTypes.func
  };

  get model() {
    return this.props.model;
  }

  closeDrawer = () => {
    if (!this.props.closeDrawer) return;
    this.props.closeDrawer();
  };

  render() {
    const { failureRedirectRoute, headerId, api, modelLabel, t } = this.props;

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
            title={t("backend.layout.social_links")}
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
              label={t("backend.forms.hashtag")}
              name="attributes[hashtag]"
              placeholder={t("backend.forms.hashtag_placeholder", {
                entity: modelLabel
              })}
            />
            <Form.TextInput
              label={t("backend.forms.social_id", { social: "Facebook" })}
              name="attributes[facebookId]"
              placeholder={t("backend.forms.social_placeholder", {
                entity: modelLabel,
                social: "Facebook"
              })}
            />
            <Form.TextInput
              label={t("backend.forms.social_id", { social: "Twitter" })}
              name="attributes[twitterId]"
              placeholder={t("backend.forms.social_placeholder", {
                entity: modelLabel,
                social: "Twitter"
              })}
            />
            <Form.TextInput
              label={t("backend.forms.social_id", { social: "Instagram" })}
              name="attributes[instagramId]"
              placeholder={t("backend.forms.social_placeholder", {
                entity: modelLabel,
                social: "Instagram"
              })}
            />
            <Form.Save text={t("actions.save")} />
          </FormContainer.Form>
        </section>
      </Authorize>
    );
  }
}

export default withTranslation()(Social);
