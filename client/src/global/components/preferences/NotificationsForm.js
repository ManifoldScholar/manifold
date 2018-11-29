import React, { Component } from "react";
import PropTypes from "prop-types";
import config from "config";
import { Collapse } from "react-collapse";
import classNames from "classnames";

export default class NotificationsForm extends Component {
  static propTypes = {
    preferences: PropTypes.object,
    changeHandler: PropTypes.func.isRequired,
    digestProjectsChangeHandler: PropTypes.func.isRequired,
    unsubscribeAllHandler: PropTypes.func.isRequired
  };

  renderNotificationSettings(preferences) {
    const digestOpen = preferences.digest !== "never";

    return (
      <div className="subscriptions">
        <h3 className="section-heading-secondary">Project Activity</h3>
        <div className="form-group">
          <div className="form-input">
            <span className="instructions">
              {`Manifold can send you a daily or weekly email with information about texts,
            resources, and resource collections that have been added to projects.`}
            </span>
          </div>
          {this.renderDigestFrequency(preferences)}
          <Collapse isOpened={digestOpen}>
            {this.renderDigestContent(preferences)}
          </Collapse>
        </div>
        <h3 className="section-heading-secondary">Other Activity</h3>
        <div className="form-group">
          {this.renderNotificationContent(preferences)}
        </div>
        <button
          className="button-bare-primary"
          onClick={this.props.unsubscribeAllHandler}
        >
          Unsubscribe From All
        </button>
      </div>
    );
  }

  renderDigestContent(preferences) {
    const items = config.app.locale.notificationPreferences.digest;

    const options = [
      { key: "followedProjects", label: "Only Projects I'm Following" }
    ];
    if (preferences.projects)
      options.unshift({ key: "projects", label: "All Projects" });

    return (
      <React.Fragment>
        <div className="form-input" key="digest-projects">
          <label htmlFor="digest-projects">
            Which projects should be included?
          </label>
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
                <span className="toggle-indicator">
                  {checked ? <i className="manicon" /> : null}
                </span>
                <span className="toggle-label">{option.label}</span>
              </label>
            );
          })}
        </div>

        {items.map(item => {
          const checked = preferences[item.key];
          return this.renderContentOption(item, checked);
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
      const checked = preferences[item.key];
      return this.renderContentOption(item, checked);
    });
  }

  renderContentOption(
    preference,
    value,
    options = { never: "No", always: "Yes" }
  ) {
    if (!preference || !value) return null;

    return (
      <div className="form-input" key={preference.key}>
        <label htmlFor={preference.key}>{preference.label}</label>
        <span className="instructions">{preference.instructions}</span>
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
              <span className="toggle-indicator">
                {checked ? <i className="manicon" /> : null}
              </span>
              <span className="toggle-label">{options[option]}</span>
            </label>
          );
        })}
      </div>
    );
  }

  render() {
    if (!this.props.preferences) return null;
    return this.renderNotificationSettings(this.props.preferences);
  }
}
