import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "config";
import { UnmountClosed as Collapse } from "react-collapse";
import classNames from "classnames";
import { UID } from "react-uid";

export default class NotificationsForm extends Component {
  static propTypes = {
    preferences: PropTypes.object,
    changeHandler: PropTypes.func.isRequired,
    digestProjectsChangeHandler: PropTypes.func.isRequired,
    unsubscribeAllHandler: PropTypes.func.isRequired
  };

  get defaultOptions() {
    return { never: "No", always: "Yes" };
  }

  renderNotificationSettings(preferences) {
    const digestOpen = preferences.digest !== "never";

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
                {this.renderDigestFrequency(preferences)}
                <Collapse isOpened={digestOpen}>
                  {this.renderDigestContent(preferences, digestOpen)}
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
                {this.renderNotificationContent(preferences)}
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

  renderDigestContent(preferences, digestOpen) {
    const items = config.app.locale.notificationPreferences.digest;

    const options = [
      { key: "followedProjects", label: "Only Projects I'm Following" }
    ];
    if (preferences.projects)
      options.unshift({ key: "projects", label: "All Projects" });

    return (
      <React.Fragment>
        <fieldset
          className="subscriptions__radio-group form-input"
          key="digest-projects"
          disabled={!digestOpen}
        >
          <legend className="subscriptions__legend">
            Which projects should be included?
          </legend>
          {options.map(option => {
            const checked = preferences[option.key] === "always";
            const inputClassNames = classNames(
              "form-toggle",
              "radio",
              "inline",
              { checked }
            );

            return (
              <label
                className={inputClassNames}
                key={option.key}
                htmlFor={options.key}
              >
                <input
                  type="radio"
                  name={option.key}
                  value="always"
                  checked={checked}
                  onChange={this.props.digestProjectsChangeHandler}
                />
                <span className="toggle-indicator" />
                <span className="toggle-label">{option.label}</span>
              </label>
            );
          })}
        </fieldset>

        {items.map(item => {
          const checked = preferences[item.key];
          return this.renderContentOption(
            item,
            checked,
            this.defaultOptions,
            !digestOpen
          );
        })}
      </React.Fragment>
    );
  }

  renderDigestFrequency(preferences) {
    const preference = {
      key: "digest",
      label: "How often would you like to be notified?"
    };
    const options = { never: "Never", daily: "Daily", weekly: "Weekly" };

    return this.renderContentOption(preference, preferences.digest, options);
  }

  renderNotificationContent(preferences) {
    const items = config.app.locale.notificationPreferences.notifications;
    return items.map(item => {
      const checked = preferences[item.key] || false;
      return this.renderContentOption(item, checked);
    });
  }

  renderContentOption(
    preference,
    value,
    options = this.defaultOptions,
    disabled
  ) {
    if (!preference) return null;
    return (
      <fieldset
        className="subscriptions__radio-group form-input"
        key={preference.key}
        disabled={disabled}
      >
        <legend className="subscriptions__legend">{preference.label}</legend>
        {preference.instructions && (
          <span className="instructions">{preference.instructions}</span>
        )}
        {Object.keys(options).map(option => {
          const checked = value === option;
          const inputClassNames = classNames("form-toggle", "radio", "inline", {
            checked
          });

          return (
            <label
              className={inputClassNames}
              key={`${preference.key}-${option}`}
            >
              <input
                type="radio"
                name={preference.key}
                value={option}
                checked={checked}
                onChange={this.props.changeHandler}
              />
              <span className="toggle-indicator" />
              <span className="toggle-label">{options[option]}</span>
            </label>
          );
        })}
      </fieldset>
    );
  }

  render() {
    if (!this.props.preferences) return null;
    return this.renderNotificationSettings(this.props.preferences);
  }
}
