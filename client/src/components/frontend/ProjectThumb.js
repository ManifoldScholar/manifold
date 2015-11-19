import React, { Component, PropTypes } from 'react';
import {Link} from 'react-router';

export default class ProjectGrid extends Component {
  static propTypes = {
    project: PropTypes.object,
    makers: PropTypes.object,
    hideMeta: PropTypes.bool,
    hideDate: PropTypes.bool,
    hideDesc: PropTypes.bool
  };

  static defaultProps = {
    hideMeta: false,
    hideDate: false,
    hideDesc: false
  };

  lookupMaker(id) {
    return this.props.makers[id];
  }

  render() {
    const project = this.props.project;

    let projectDate;
    if (this.props.hideDate) {
      projectDate = '';
    } else {
      projectDate = (
        <div className="date">
          {'Published June, 2016'}
        </div>
      );
    }

    let projectDesc;
    if (this.props.hideDesc) {
      projectDesc = '';
    } else {
      projectDesc = (
        <p className="description">
          {project.attributes.description}
        </p>
      );
    }

    let projectMeta;
    if (this.props.hideMeta) {
      projectMeta = '';
    } else {
      projectMeta = (
        <div className="meta">
          <h3 className="title">{project.attributes.title}</h3>
          <div className="makers">
            {project.relationships.creators.data.map((makerRel) => {
              const maker = this.lookupMaker(makerRel.id);
              return (
                  <span key={maker.id}>
                {maker.attributes.name}
              </span>
              );
            })}
          </div>

          {projectDate}
          {projectDesc}
        </div>
      );
    }

    return (
      <Link to={`/browse/project/${project.id}`}>
        {/* Figure wrapper, controls maximum width of figure */}
        <div className="figure-wrapper">
          <figure>
            <img src={project.attributes.coverUrl}
                 alt={`Click to view ${project.attributes.title}`} />
            <i className="manicon manicon-plus"></i>
          </figure>
        </div>
        {projectMeta}
      </Link>
    );
  }
}
