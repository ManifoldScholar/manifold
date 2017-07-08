import React, { Component } from "react";
import PropTypes from "prop-types";
import { Utility, Event, Layout } from "components/frontend";
import lh from "helpers/linkHandler";

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
        <section className="bg-neutral05">
          <Utility.BackLinkPrimary
            link={lh.link("frontendProject", project.id)}
            title={project.attributes.title}
          />
        </section>
        <section>
          <div className="container">
            <header className="section-heading">
              <h4 className="title">
                <i className="manicon manicon-pulse" />
                {"All Activity"}
              </h4>
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
