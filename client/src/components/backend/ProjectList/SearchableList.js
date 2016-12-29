import React, { Component, PropTypes } from 'react';
import { Utility, Project as globalProject } from 'components/global';
import { Link } from 'react-router';

export default class SearchableList extends Component {

  static displayName = "ProjectList.SearchableList";

  static propTypes = {
    projects: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  constructor() {
    super();
    this.renderProjectsList = this.renderProjectsList.bind(this);
    this.renderProject = this.renderProject.bind(this);
    this.renderProjectMakers = this.renderProjectMakers.bind(this);
  }

  renderProjectMakers(makers) {
    let output = null;
    if (makers && makers.length > 0) {
      output = (
        <div className="relations-list">
          {makers.map((maker, i) => {
            let nameList = maker.attributes.fullName;
            if (i > 0) nameList = ', ' + nameList;
            return nameList;
          })}
        </div>
      );
    }

    return output;
  }

  renderProject(project) {
    const attr = project.attributes;

    return (
      <li key={project.id}>
        <Link to={`/backend/project/${project.id}`}>
          <header>
            <figure className="cover">
              {attr.coverUrl ? (<img src={attr.coverUrl} />) : <globalProject.Placeholder/>}
            </figure>
            <div className="meta">
              <h3 className="name">
                {attr.title}
                  <span className="subtitle">
                    {attr.subtitle}
                  </span>
              </h3>
              {this.renderProjectMakers(project.relationships.creators)}
            </div>
          </header>
          <span className="label">
            Edit
          </span>
        </Link>
      </li>
    );
  }

  renderProjectsList() {
    const projects = this.props.projects;
    let output = null;

    if (projects.length > 0) {
      output = (
        <div>
          <Utility.EntityCount
            pagination={this.props.pagination}
            singularUnit="project"
            pluralUnit="projects"
          />
          <ul>
            {projects.map((project) => {
              return this.renderProject(project);
            })}
          </ul>
        </div>
      );
    }

    return output;
  }

  render() {
    return (
      <div>
        <form className="form-search-filter">
          <div className="search">
            <button>
              <i className="manicon manicon-magnify"></i>
              <span className="screen-reader-text">Click to search</span>
            </button>
            <input type="text" placeholder="Search..." />
          </div>
          <button className="button-bare-primary">{'More Search Options'}</button>
          <button className="button-bare-primary reset">{'Reset Search'}</button>
        </form>
        <nav className="vertical-list-primary">
          {this.renderProjectsList()}
        </nav>
        <Utility.Pagination
          pagination={this.props.pagination}
          paginationClickHandler={this.props.paginationClickHandler}
        />
      </div>
    );
  }
}
