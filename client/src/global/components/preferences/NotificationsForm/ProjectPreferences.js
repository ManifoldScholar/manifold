import React from "react";
import PropTypes from "prop-types";
import config from "config";
import Collapse from "global/components/Collapse";
import RadioGroup from "./RadioGroup";
import { useCollapseContext } from "hooks";

function ProjectPreferences({ preferences, onChange, onDigestChange }) {
  const { toggleProps } = useCollapseContext();
  const items = config.app.locale.notificationPreferences.digest;
  const options = {
    ...(preferences.projects && { projects: "All Projects" }),
    followedProjects: "Only Projects I'm Following"
  };

  return (
    <>
      <RadioGroup
        preference={{
          key: "digest",
          label: "How often would you like to be notified?"
        }}
        value={preferences.digest}
        options={{
          never: "Never",
          daily: "Daily",
          weekly: "Weekly"
        }}
        onChange={onChange}
        inputProps={{
          ...toggleProps,
          onClick: null,
          type: "radio",
          "aria-expanded":
            preferences.digest === "daily" || preferences.digest === "weekly"
        }}
      />
      <Collapse.Content>
        <div className="subscriptions__collapsed-group">
          <RadioGroup
            preference={{
              key: "digest-projects",
              label: "Which projects should be included?"
            }}
            value={Object.keys(preferences).find(
              prefKey => prefKey in options && preferences[prefKey] === "always"
            )}
            options={options}
            onChange={onDigestChange}
          />
          {items.map(item => {
            return (
              <RadioGroup
                key={item.key}
                preference={item}
                value={preferences[item.key]}
                onChange={onChange}
              />
            );
          })}
        </div>
      </Collapse.Content>
    </>
  );
}

ProjectPreferences.propTypes = {
  preferences: PropTypes.object,
  onChange: PropTypes.func,
  onDigestChange: PropTypes.func
};

export default ProjectPreferences;
