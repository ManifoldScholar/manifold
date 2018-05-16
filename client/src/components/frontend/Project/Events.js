import React, { Component } from "react";
import PropTypes from "prop-types";
import { Utility, Event, Layout } from "components/frontend";
import lh from "helpers/linkHandler";
import { HeadContent } from "components/global";

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
          title={`${this.props.project.attributes.title} | Events`}
          description={this.props.project.attributes.description}
          image={this.props.project.attributes.avatarStyles.mediumSquare}
          appendTitle
        />
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={lh.link("frontendProject", project.attributes.slug)}
            title={project.attributes.title}
          />
        </section>
        <section>
          <div className="container">
            <header className="section-heading">
              <div className="main">
                <i className="manicon manicon-pulse" aria-hidden="true" />
                <div className="body">
                  <h4 className="title">{"All Activity"}</h4>
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
