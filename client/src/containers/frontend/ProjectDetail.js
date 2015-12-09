import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { ProjectDetailHero } from '../../components/frontend';
import { fetchOneProject } from '../../actions/shared/collections';
import connectData from '../../decorators/connectData';

function fetchData(getState, dispatch, location, params) {
  return Promise.all([
    fetchOneProject(params.id)(dispatch, getState)
  ]);
}

function mapStateToProps(state) {
  const fetchOneProjectResult = state.collections.results.fetchOneProject.entities;
  const projects = state.collections.entities.projects;
  const project = projects[fetchOneProjectResult];

  return {
    project: project,
    makers: state.collections.entities.makers
  };
}

@connectData(fetchData)
@connect(mapStateToProps)
export default class ProjectDetail extends Component {

  static propTypes = {
    project: PropTypes.object,
    makers: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  };

  lookupMaker = (id) => {
    return this.props.makers[id];
  };

  render = () => {
    const project = this.props.project;
    const makers = [];

    // Fill makers array with available makers
    if (project.relationships.creators.data.length) {
      project.relationships.creators.data.forEach((makerRel) => {
        makers.push(this.lookupMaker(makerRel.id));
      });
    }

    return (
        <div>
          <section className="neutral20">
            <div className="container">
              <ProjectDetailHero project={project} makers={makers} />
            </div>
          </section>
          <section>
            <div className="container">
              <header className="rel">
                <div className="container">
                  <h4 className="section-heading">
                    <i className="manicon manicon-pulse"></i>
                    {'Recent Activity'}
                  </h4>
                </div>
                <div className="section-heading-utility-right">
                  <Link to={`#`} className="button-primary">
                    See all Activity
                  </Link>
                </div>
              </header>
            </div>
          </section>
        </div>
    );
  };
}
