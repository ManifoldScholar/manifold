import React, { Component } from "react";
import Utility from "global/components/utility";
import config from "config";
import PropTypes from "prop-types";

import get from "lodash/get";

import withSettings from "hoc/with-settings";

const TEXT_PATHS = {
  heading: [
    {
      prop: "project",
      path: ["attributes"],
      name: "restrictedAccessHeading"
    },
    {
      prop: "settings",
      path: ["attributes", "general"],
      name: "restrictedAccessHeading"
    },
    {
      prop: "config",
      path: ["app", "locale", "notifications", "projectAuthorizationNotice"],
      name: "heading"
    }
  ],
  body: [
    {
      prop: "project",
      path: ["attributes"],
      name: "restrictedAccessBody",
      show: "restrictedAccessBodyFormatted"
    },
    {
      prop: "settings",
      path: ["attributes", "general"],
      name: "restrictedAccessBody",
      show: "restrictedAccessBodyFormatted"
    },
    {
      prop: "config",
      path: ["app", "locale", "notifications", "projectAuthorizationNotice"],
      name: "body"
    }
  ]
};

export function fetchTextPath(props, type) {
  const paths = get(TEXT_PATHS, type, []);

  let found = null;

  paths.forEach(({ prop, path, name, show }) => {
    if (found) return;

    const presence = get(props, [prop, ...path, name]);

    if (presence) {
      if (show) {
        found = get(props, [prop, ...path, show], presence);
      } else {
        found = presence;
      }
    }
  });

  return found;
}

export class BaseAccessDenied extends Component {
  static displayName = "Frontend.Project.AccessDenied";

  static propTypes = {
    config: PropTypes.object,
    project: PropTypes.shape({
      attributes: PropTypes.shape({
        restrictedAccessHeading: PropTypes.string,
        restrictedAccessBody: PropTypes.string,
        restrictedAccessBodyFormatted: PropTypes.string
      })
    }),
    settings: PropTypes.shape({
      attributes: PropTypes.shape({
        general: PropTypes.shape({
          restrictedAccessHeading: PropTypes.string,
          restrictedAccessBody: PropTypes.string,
          restrictedAccessBodyFormatted: PropTypes.string
        })
      })
    })
  };

  static defaultProps = {
    config
  };

  render() {
    const heading = fetchTextPath(this.props, "heading");

    const body = fetchTextPath(this.props, "body");

    return (
      <section className="project-content-block">
        <div className="container flush entity-section-wrapper">
          <div className="entity-section-wrapper__body entity-section-wrapper__body--notice">
            <Utility.IconComposer icon="stopSign64" size={50} />
            <div>
              <span className="entity-section-wrapper__body--incomplete-header">
                {heading}
              </span>
              <span className="entity-section-wrapper__link-container">
                {this.presentBlockErrors}
                <span
                  className="entity-section-wrapper__body--warning"
                  dangerouslySetInnerHTML={{
                    __html: body
                  }}
                />
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default withSettings(BaseAccessDenied);
