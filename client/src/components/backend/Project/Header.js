import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';

export default class ProjectHeader extends Component {

  static displayName = "Project.Header";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const attr = project.attributes;
    return (
      <section className="bg-neutral95">
        <div className="container flush">
          <Link to={'/backend/'} className="back-link-primary">
            <i className="manicon manicon-arrow-left"></i>
            Back to: <span>ALL PROJECTS</span>
          </Link>
          <header className="project-header">
            <figure>
              <i className="manicon manicon-project-placeholder"></i>
            </figure>
            <div className="project-title">
              <h1>
                {attr.title}
                <span className="subtitle">
                  {attr.subtitle}
                </span>
              </h1>
              <div className="project-utility">
                <button className="button-bare-primary">
                  Preview <i className="manicon manicon-eye-outline"></i>
                </button>
                <button className="button-bare-primary">
                  Duplicate <i className="manicon manicon-check-double"></i>
                </button>
                <button className="button-bare-primary">
                  Delete <i className="manicon manicon-trashcan"></i>
                </button>
              </div>
            </div>
          </header>
        </div>
      </section>
    );
  }
}
