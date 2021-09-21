import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "config";
import { UID } from "react-uid";
import Collapse from "global/components/Collapse";
import RadioGroup from "./RadioGroup";
import ProjectPreferences from "./ProjectPreferences";

export default class NotificationsForm extends Component {
  static propTypes = {
    preferences: PropTypes.object,
    changeHandler: PropTypes.func.isRequired,
    digestProjectsChangeHandler: PropTypes.func.isRequired,
    unsubscribeAllHandler: PropTypes.func.isRequired
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

    return (
      <div className="subscriptions">
        <UID name={id => `project-activity-${id}`}>
          {id => (
            <div
              role="group"
              aria-labelledby={`${id}-header`}
              aria-describedby={`${id}-instructions`}
            >
              <h2 id={`${id}-header`} className="section-heading-secondary">
                Project Activity
              </h2>
              <div className="form-group">
                <div className="form-input">
                  <span id={`${id}-instructions`} className="instructions">
                    {`Manifold can send you a daily or weekly email with information about texts,
                  resources, and resource collections that have been added to projects.`}
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
        </UID>
        <UID name={id => `other-activity-${id}`}>
          {id => (
            <div role="group" aria-labelledby={`${id}-header`}>
              <h2 id={`${id}-header`} className="section-heading-secondary">
                Other Activity
              </h2>
              <div className="form-group">
                {this.renderNotificationContent()}
              </div>
            </div>
          )}
        </UID>
        <button
          className="utility-button"
          onClick={this.props.unsubscribeAllHandler}
        >
          <span className="utility-button__text utility-button__text--underlined">
            {"Unsubscribe From All"}
          </span>
        </button>
      </div>
    );
  }
}
