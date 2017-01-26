import React, { PureComponent, PropTypes } from 'react';
import { Utility, Project as globalProject } from 'components/global';
import { Link } from 'react-router';
import get from 'lodash/get';

export default class SearchableList extends PureComponent {

  static displayName = "ProjectList.SearchableList";

  static propTypes = {
    projects: PropTypes.array,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func
  };

  constructor() {
    super();

    this.state = this.initialState();

    this.setKeyword = this.setKeyword.bind(this);
    this.resetSearch = this.resetSearch.bind(this);
    this.renderProjectsList = this.renderProjectsList.bind(this);
    this.renderProject = this.renderProject.bind(this);
    this.renderProjectMakers = this.renderProjectMakers.bind(this);
  }

  initialState() {
    return {
      inputs: { keyword: "" },
      filter: { }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (get(prevState, 'filter.keyword') !== get(this.state, 'filter.keyword')) {
      this.props.filterChangeHandler(this.state.filter);
    }
  }

  resetSearch(event) {
    event.preventDefault();
    this.setState(this.initialState());
  }

  setKeyword(event) {
    const keyword = event.target.value;
    const filter = Object.assign({}, this.state.filter);
    if (keyword === "") {
      delete filter.keyword;
      delete filter.typeahead;
    } else {
      filter.keyword = keyword;
      filter.typeahead = true;
    }
    this.setState({ inputs: { keyword }, filter });
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
    } else {
      output = (
        <p className="list-total">Sorry, no results were found.</p>
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
            <input
              value={this.state.inputs.keyword}
              type="text"
              placeholder="Search..."
              onChange={this.setKeyword}
            />
          </div>
          <button
            onClick={this.resetSearch}
            className="button-bare-primary reset"
          >
            {'Reset Search'}
          </button>
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
