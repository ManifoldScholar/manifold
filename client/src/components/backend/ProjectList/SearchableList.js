import React, { Component, PropTypes } from 'react';
import { Project as globalProject } from 'components/global';
import { Utility } from 'components/backend';
import { Link } from 'react-router';

export default class SearchableList extends Component {

  static displayName = "ProjectList.SearchableList";

  static propTypes = {};

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
        <nav className="projects-vertical-primary">
          <p className="list-total">
            {'Showing 1-10 of 32 total projects:'}
          </p>
          <ul>
            <li>
              <Link to="#">
                <figure>
                  <img src="/static/placeholder/cover_rune-stone.png" />
                </figure>
                <div className="meta">
                  <h3 className="project-title">
                    Cultures of Insecurity
                    <span className="subtitle">
                      The Project’s Subtitle Goes Here
                    </span>
                  </h3>
                </div>
                <span className="label">
                  Edit
                </span>
              </Link>
            </li>
            <li>
              <Link to="#">
                <figure>
                  <globalProject.Placeholder />
                </figure>
                <div className="meta">
                  <h3 className="project-title">
                    Cultures of Insecurity
                    <span className="subtitle">
                      The Project’s Subtitle Goes Here
                    </span>
                  </h3>
                  <div className="project-makers">
                    Jennifer L Feeley, Sarah Ann Wells
                  </div>
                </div>
                <span className="label">
                  Edit
                </span>
              </Link>
            </li>
          </ul>
        </nav>
        <Utility.Pagination />
      </div>
    );
  }
}
