import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import { ResourceList } from 'components/frontend';

import { entityStoreActions } from 'actions';
import { entityUtils } from 'utils';
import { projectsAPI } from 'api';

const { select } = entityUtils;
const { request, flush, requests } = entityStoreActions;

class ProjectResourcesContainer extends Component {
  static fetchData(getState, dispatch, location, params) {
    const projectRequest =
        request(projectsAPI.show(params.id), requests.showProjectDetail);
    const { promise: one } = dispatch(projectRequest);
    return Promise.all([one]);
  }

  static mapStateToProps(state) {
    return {
      project: select(requests.showProjectDetail, state.entityStore)
    };
  }

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    return (
      <div>
        <section className="bg-neutral05">
          <div className="container flush">
            <Link to={`/browse/project/${project.id}`} className="back-link-section">
              <i className="manicon manicon-arrow-left"></i>
              Back to Project
              <span>
                {project.attributes.title}
              </span>
            </Link>
          </div>
        </section>
        <section>
          <div className="container">
            <header className="section-heading">
              <h2 className="title">
                <i className="manicon manicon-cube-shine"></i>
                All Project Resources
              </h2>
            </header>

            <form className="form-list-filter">
              <div className="search-input">
                <button className="search-button" type="submit">
                  <i className="manicon manicon-magnify"></i>
                </button>
                <input type="text" placeholder="Search"/>
              </div>
              <div className="select-group">
                <div className="select">
                  <select defaultValue="default">
                    <option
                      value="default"
                      disabled="disabled"
                    >
                      Type:
                    </option>
                    <option>Document</option>
                    <option>Image</option>
                    <option>PDF</option>
                  </select>
                  <i className="manicon manicon-caret-down"></i>
                </div>
                <div className="select">
                  <select defaultValue="default">
                    <option
                      value="default"
                      disabled="disabled"
                    >
                      Tag:
                    </option>
                    <option>Japan</option>
                    <option>Photography</option>
                    <option>Second Interview</option>
                  </select>
                  <i className="manicon manicon-caret-down"></i>
                </div>
                <div className="select">
                  <select defaultValue="default">
                    <option
                      value="default"
                      disabled="disabled"
                    >
                      Sort By:
                    </option>
                    <option>A-Z</option>
                    <option>A-Z</option>
                    <option>Z-A</option>
                    <option>Upload Date</option>
                  </select>
                  <i className="manicon manicon-caret-down"></i>
                </div>
              </div>
              <button className="reset-button">
                {'Reset Search + Filters'}
              </button>
            </form>

            <ResourceList/>
          </div>
        </section>
      </div>
    );
  }
}

const ProjectResources = connect(
    ProjectResourcesContainer.mapStateToProps
)(ProjectResourcesContainer);

export default ProjectResources;
