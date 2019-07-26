import React, { Component } from "react";
import PropTypes from "prop-types";
import Layout from "frontend/components/layout";
import Event from "frontend/components/event";
import Utility from "frontend/components/utility";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import IconComposer from "global/components/utility/IconComposer";

export default class ProjectEvents extends Component {
  static displayName = "Project.Events";

  static propTypes = {
    project: PropTypes.object,
    events: PropTypes.array,
    pagination: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <div>
        <HeadContent
          title={`${this.props.project.attributes.titlePlaintext} | Events`}
          description={this.props.project.attributes.description}
          image={this.props.project.attributes.avatarStyles.mediumSquare}
          appendTitle
        />
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={lh.link("frontendProjectDetail", project.attributes.slug)}
            title={project.attributes.titlePlaintext}
          />
        </section>
        <section>
          <div className="container entity-section-wrapper">
            <header className="section-heading entity-section-wrapper__heading">
              <div className="main">
                <IconComposer icon="recentActivity64" size={56} />
                <div className="body">
                  <h2 className="title">{"All Activity"}</h2>
                </div>
              </div>
            </header>
            <Event.List
              project={this.props.project}
              events={this.props.events}
              pagination={this.props.pagination}
            />
          </div>
        </section>
        <Layout.ButtonNavigation />
      </div>
    );
  }
}
