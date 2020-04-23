import React, { Component } from "react";
import Utility from "global/components/utility";
import config from "config";
import PropTypes from "prop-types";

export default class AccessDenied extends Component {
  static propTypes = {
    project: PropTypes.object
  };

  isPresent(value) {
    return Boolean(value);
  }

  isBlank(value) {
    return !this.isPresent(value);
  }

  get project() {
    return this.props.project;
  }

  get heading() {
    if (this.isPresent(this.project.attributes.restrictedAccessHeading))
      return this.project.attributes.restrictedAccessHeading;
    return config.app.locale.notifications.projectAuthorizationNotice.heading;
  }

  get body() {
    if (this.isPresent(this.project.attributes.restrictedAccessBody))
      return this.project.attributes.restrictedAccessBodyFormatted;
    return config.app.locale.notifications.projectAuthorizationNotice.body;
  }

  render() {
    return (
      <section className="project-content-block">
        <div className="container flush entity-section-wrapper">
          <div className="entity-section-wrapper__body entity-section-wrapper__body--notice">
            <Utility.IconComposer icon="stopSign64" size={50} />
            <div>
              <span className="entity-section-wrapper__body--incomplete-header">
                {this.heading}
              </span>
              <span className="entity-section-wrapper__link-container">
                {this.presentBlockErrors}
                <span
                  className="entity-section-wrapper__body--warning"
                  dangerouslySetInnerHTML={{
                    __html: this.body
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
