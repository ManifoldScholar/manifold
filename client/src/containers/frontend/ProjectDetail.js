import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
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

    // Setup makers array as long as there is one
    if (project.relationships.creators.length) {
      project.relationships.creators.data.forEach((makerRel) => {
        makers.push(this.lookupMaker(makerRel.id));
      });
    }

    return (
        <div>
          <section className="neutral20">
            <div className="container">
              {/* TODO: Detail hero should be its own component */}
               <div className="project-detail-hero">
                 <div className="project-info">
                   {project.relationships.creators.data.map((makerRel) => {
                     const maker = this.lookupMaker(makerRel.id);
                     return (
                         <figure className="maker-avatar" key={maker.id}>
                           {/* If avatars will not be pre-rendered as squares they will require a styled wrapper here */}
                           <img src="/placeholder/user-avatar-nornes01.jpg"/>
                           <figcaption>
                             {maker.attributes.name}
                           </figcaption>
                         </figure>
                     );
                   })}
                   <h1 className="project-title">
                     {project.attributes.title}<span className="project-subtitle">{project.attributes.subtitle}</span>
                   </h1>

                   <section className="project-summary">
                     <p>
                       {project.attributes.description}
                     </p>
                   </section>

                   <section className="project-entry">
                     <a href="#" className="button-secondary button-reader">
                       <i className="manicon manicon-glasses"></i>
                       {'Start Reading'}
                     </a>

                     <a href="#" className="button-secondary-dull button-toc">
                       <i className="manicon manicon-bullet-list"></i>
                       {'View Table of Contents'}
                     </a>

                     <a href="#" className="button-tagged-dull">
                         {'Buy Print Version'}
                       <span className="price">{'$27.50'}</span>
                     </a>
                   </section>
                 </div>
                 <div className="project-image">
                   <img src={project.attributes.coverUrl}/>
                 </div>
               </div>
            </div>
          </section>
        </div>
    );
  };
}
