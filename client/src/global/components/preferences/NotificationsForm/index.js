import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import Collapse from "global/components/Collapse";
import RadioGroup from "./RadioGroup";
import ProjectPreferences from "./ProjectPreferences";
import humps from "humps";
import Authorization from "helpers/authorization";
import Form from "global/components/form";
import * as Styled from "./styles";

class NotificationsForm extends Component {
  static propTypes = {
    authentication: PropTypes.object,
    preferences: PropTypes.object,
    changeHandler: PropTypes.func.isRequired,
    digestProjectsChangeHandler: PropTypes.func.isRequired,
    unsubscribeAllHandler: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.authorization = new Authorization();
  }

  get preferences() {
    return this.props.preferences;
  }

  get digestOpen() {
    return this.props.preferences.digest !== "never";
  }

  renderNotificationContent() {
    const { authentication } = this.props;
    const items = ["repliesToMe"];
    const isAdmin = this.authorization.authorizeKind({
      authentication,
      kind: "admin"
    });
    const isProjectCreator = this.authorization.authorizeKind({
      authentication,
      kind: "project_creator"
    });

    if (isAdmin || isProjectCreator)
      items.push("projectCommentsAndAnnotations");
    if (isAdmin) items.push("flaggedResources");

    return items.map(item => {
      const i18nKey = humps.decamelize(item, { separator: "_" }).toLowerCase();
      const label = this.props.t(
        `forms.notifications.activity_preferences.${i18nKey}_label`
      );
      const instructions = this.props.t(
        `forms.notifications.activity_preferences.${i18nKey}_instructions`
      );

      const checked = this.preferences[item] || false;

      return (
        <RadioGroup
          key={item}
          preference={{ key: item, label, instructions }}
          value={checked}
          onChange={this.props.changeHandler}
        />
      );
    });
  }

  render() {
    if (!this.preferences) return null;

    const t = this.props.t;

    return (
      <>
        <Form.FieldGroup
          label={t("forms.notifications.project_activity")}
          instructions={t("forms.notifications.project_activity_instructions")}
          gapLg
        >
          <Collapse initialVisible={this.digestOpen}>
            <ProjectPreferences
              preferences={this.preferences}
              onChange={this.props.changeHandler}
              onDigestChange={event =>
                this.props.digestProjectsChangeHandler(event.target.value)
              }
            />
          </Collapse>
        </Form.FieldGroup>
        <Form.FieldGroup label={t("forms.notifications.other_activity")} gapLg>
          {this.renderNotificationContent()}
        </Form.FieldGroup>
        <Styled.Button
          className="utility-button"
          onClick={this.props.unsubscribeAllHandler}
        >
          <span className="utility-button__text utility-button__text--underlined">
            {t("forms.notifications.unsubscribe")}
          </span>
        </Styled.Button>
      </>
    );
  }
}

export default withTranslation()(NotificationsForm);
