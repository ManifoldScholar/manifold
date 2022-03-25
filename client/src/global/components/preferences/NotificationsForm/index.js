import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import config from "config";
import { UIDConsumer } from "react-uid";
import Collapse from "global/components/Collapse";
import RadioGroup from "./RadioGroup";
import ProjectPreferences from "./ProjectPreferences";

class NotificationsForm extends Component {
  static propTypes = {
    preferences: PropTypes.object,
    changeHandler: PropTypes.func.isRequired,
    digestProjectsChangeHandler: PropTypes.func.isRequired,
    unsubscribeAllHandler: PropTypes.func.isRequired,
    t: PropTypes.func
  };

  get preferences() {
    return this.props.preferences;
  }

  get digestOpen() {
    return this.props.preferences.digest !== "never";
  }

  renderNotificationContent() {
    const items = config.app.locale.notificationPreferences.notifications;

    return items.map(item => {
      const checked = this.preferences[item.key] || false;
      return (
        <RadioGroup
          key={item.key}
          preference={item}
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
      <div className="subscriptions">
        <UIDConsumer name={id => `project-activity-${id}`}>
          {id => (
            <div
              role="group"
              aria-labelledby={`${id}-header`}
              aria-describedby={`${id}-instructions`}
            >
              <h2 id={`${id}-header`} className="section-heading-secondary">
                {t("forms.notifications.project_activity")}
              </h2>
              <div className="form-group">
                <div className="form-input">
                  <span id={`${id}-instructions`} className="instructions">
                    {t("forms.notifications.project_activity_instructions")}
                  </span>
                </div>
                <Collapse initialVisible={this.digestOpen}>
                  <ProjectPreferences
                    preferences={this.preferences}
                    onChange={this.props.changeHandler}
                    onDigestChange={event =>
                      this.props.digestProjectsChangeHandler(event.target.value)
                    }
                  />
                </Collapse>
              </div>
            </div>
          )}
        </UIDConsumer>
        <UIDConsumer name={id => `other-activity-${id}`}>
          {id => (
            <div role="group" aria-labelledby={`${id}-header`}>
              <h2 id={`${id}-header`} className="section-heading-secondary">
                {t("forms.notifications.other_activity")}
              </h2>
              <div className="form-group">
                {this.renderNotificationContent()}
              </div>
            </div>
          )}
        </UIDConsumer>
        <button
          className="utility-button"
          onClick={this.props.unsubscribeAllHandler}
        >
          <span className="utility-button__text utility-button__text--underlined">
            {t("forms.notifications.unsubscribe")}
          </span>
        </button>
      </div>
    );
  }
}

export default withTranslation()(NotificationsForm);
